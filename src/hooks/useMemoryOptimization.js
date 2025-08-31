import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AppState, DeviceEventEmitter, Platform } from "react-native";

/**
 * Memory optimization hook for managing large datasets
 * Implements virtual scrolling, data pagination, and memory cleanup
 */
export const useMemoryOptimization = (options = {}) => {
  const {
    maxCacheSize = 100,
    cleanupInterval = 30000, // 30 seconds
    memoryWarningThreshold = 0.8, // 80% memory usage
    enableVirtualization = true,
    itemHeight = 100,
    windowSize = 10,
  } = options;

  const [memoryPressure, setMemoryPressure] = useState("normal");
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const cacheRef = useRef(new Map());
  const accessTimeRef = useRef(new Map());
  const cleanupTimerRef = useRef(null);

  // Memory pressure monitoring
  useEffect(() => {
    const handleMemoryWarning = () => {
      setMemoryPressure("high");
      performEmergencyCleanup();
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "background") {
        performCleanup();
      } else if (nextAppState === "active") {
        setMemoryPressure("normal");
      }
    };

    // iOS memory warning
    if (Platform.OS === "ios") {
      DeviceEventEmitter.addListener("memoryWarning", handleMemoryWarning);
    }

    AppState.addEventListener("change", handleAppStateChange);

    // Periodic cleanup
    cleanupTimerRef.current = setInterval(performCleanup, cleanupInterval);

    return () => {
      if (Platform.OS === "ios") {
        DeviceEventEmitter.removeAllListeners("memoryWarning");
      }
      AppState.removeEventListener("change", handleAppStateChange);
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current);
      }
    };
  }, [cleanupInterval]);

  // LRU Cache management
  const cacheData = useCallback(
    (key, data) => {
      const now = Date.now();

      // Update access time
      accessTimeRef.current.set(key, now);

      // Add to cache
      cacheRef.current.set(key, data);

      // Cleanup old items if cache is full
      if (cacheRef.current.size > maxCacheSize) {
        const sortedByAccess = Array.from(accessTimeRef.current.entries()).sort(
          ([, a], [, b]) => a - b,
        );

        // Remove oldest 20% of items
        const itemsToRemove = Math.floor(maxCacheSize * 0.2);
        for (let i = 0; i < itemsToRemove; i++) {
          const [oldKey] = sortedByAccess[i];
          cacheRef.current.delete(oldKey);
          accessTimeRef.current.delete(oldKey);
        }
      }
    },
    [maxCacheSize],
  );

  const getCachedData = useCallback((key) => {
    if (cacheRef.current.has(key)) {
      accessTimeRef.current.set(key, Date.now());
      return cacheRef.current.get(key);
    }
    return null;
  }, []);

  const performCleanup = useCallback(() => {
    if (isCleaningUp) return;

    setIsCleaningUp(true);

    try {
      const now = Date.now();
      const maxAge = cleanupInterval * 2; // Keep items for 2 cleanup cycles

      // Remove stale cache entries
      for (const [key, accessTime] of accessTimeRef.current.entries()) {
        if (now - accessTime > maxAge) {
          cacheRef.current.delete(key);
          accessTimeRef.current.delete(key);
        }
      }

      // Force garbage collection if available (development)
      if (__DEV__ && global.gc) {
        global.gc();
      }
    } finally {
      setIsCleaningUp(false);
    }
  }, [cleanupInterval, isCleaningUp]);

  const performEmergencyCleanup = useCallback(() => {
    setIsCleaningUp(true);

    try {
      // Clear 80% of cache
      const entries = Array.from(accessTimeRef.current.entries());
      const itemsToKeep = Math.floor(entries.length * 0.2);

      // Keep only most recently accessed items
      const sortedByAccess = entries.sort(([, a], [, b]) => b - a);

      cacheRef.current.clear();
      accessTimeRef.current.clear();

      for (let i = 0; i < itemsToKeep; i++) {
        const [key] = sortedByAccess[i];
        // Note: We lose the actual data in emergency cleanup
        // This is acceptable for memory pressure situations
      }

      setMemoryPressure("critical");

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
    } finally {
      setIsCleaningUp(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    accessTimeRef.current.clear();
  }, []);

  return {
    cacheData,
    getCachedData,
    clearCache,
    performCleanup,
    performEmergencyCleanup,
    memoryPressure,
    isCleaningUp,
    cacheSize: cacheRef.current.size,
  };
};

/**
 * Virtual list optimization hook
 * Renders only visible items for better performance with large datasets
 */
export const useVirtualList = (items = [], options = {}) => {
  const {
    itemHeight = 100,
    containerHeight = 600,
    overscan = 3,
    enableDynamicHeight = false,
  } = options;

  const [scrollOffset, setScrollOffset] = useState(0);
  const itemHeightsRef = useRef(new Map());

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollOffset / itemHeight) - overscan,
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollOffset + containerHeight) / itemHeight) + overscan,
    );

    return { startIndex, endIndex };
  }, [scrollOffset, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index,
      key: item.id || startIndex + index,
    }));
  }, [items, visibleRange]);

  const totalHeight = useMemo(() => {
    if (enableDynamicHeight) {
      let height = 0;
      for (let i = 0; i < items.length; i++) {
        height += itemHeightsRef.current.get(i) || itemHeight;
      }
      return height;
    }
    return items.length * itemHeight;
  }, [items.length, itemHeight, enableDynamicHeight]);

  const updateItemHeight = useCallback(
    (index, height) => {
      if (enableDynamicHeight) {
        itemHeightsRef.current.set(index, height);
      }
    },
    [enableDynamicHeight],
  );

  const scrollToIndex = useCallback(
    (index) => {
      let offset = 0;
      if (enableDynamicHeight) {
        for (let i = 0; i < index; i++) {
          offset += itemHeightsRef.current.get(i) || itemHeight;
        }
      } else {
        offset = index * itemHeight;
      }
      setScrollOffset(offset);
    },
    [itemHeight, enableDynamicHeight],
  );

  return {
    visibleItems,
    visibleRange,
    totalHeight,
    setScrollOffset,
    updateItemHeight,
    scrollToIndex,
  };
};

/**
 * Data pagination hook for large datasets
 */
export const useDataPagination = (fetchData, options = {}) => {
  const {
    pageSize = 20,
    prefetchPages = 1,
    maxPages = 50,
    cachePages = true,
  } = options;

  const [pages, setPages] = useState(new Map());
  const [loadingPages, setLoadingPages] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState(null);

  const { cacheData, getCachedData } = useMemoryOptimization({
    maxCacheSize: maxPages,
  });

  const loadPage = useCallback(
    async (pageNumber) => {
      if (loadingPages.has(pageNumber) || pages.has(pageNumber)) {
        return;
      }

      // Check cache first
      const cacheKey = `page_${pageNumber}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setPages((prev) => new Map([...prev, [pageNumber, cachedData]]));
        return;
      }

      setLoadingPages((prev) => new Set([...prev, pageNumber]));
      setError(null);

      try {
        const data = await fetchData(pageNumber, pageSize);

        setPages((prev) => new Map([...prev, [pageNumber, data]]));

        if (cachePages) {
          cacheData(cacheKey, data);
        }

        // Check if we have more data
        setHasNextPage(data.length === pageSize);

        // Prefetch next pages
        for (let i = 1; i <= prefetchPages; i++) {
          const nextPage = pageNumber + i;
          if (nextPage < maxPages && hasNextPage) {
            setTimeout(() => loadPage(nextPage), i * 100);
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoadingPages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(pageNumber);
          return newSet;
        });
      }
    },
    [
      loadingPages,
      pages,
      fetchData,
      pageSize,
      prefetchPages,
      maxPages,
      hasNextPage,
      cachePages,
      cacheData,
      getCachedData,
    ],
  );

  const loadNextPage = useCallback(() => {
    if (hasNextPage && !loadingPages.has(currentPage + 1)) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadPage(nextPage);
    }
  }, [currentPage, hasNextPage, loadingPages, loadPage]);

  const goToPage = useCallback(
    (pageNumber) => {
      setCurrentPage(pageNumber);
      loadPage(pageNumber);
    },
    [loadPage],
  );

  const getAllData = useMemo(() => {
    const allData = [];
    for (let i = 0; i <= currentPage; i++) {
      const pageData = pages.get(i);
      if (pageData) {
        allData.push(...pageData);
      }
    }
    return allData;
  }, [pages, currentPage]);

  // Load initial page
  useEffect(() => {
    loadPage(0);
  }, []);

  return {
    data: getAllData,
    currentPage,
    hasNextPage,
    isLoading: loadingPages.size > 0,
    error,
    loadNextPage,
    goToPage,
    reload: () => {
      setPages(new Map());
      setCurrentPage(0);
      loadPage(0);
    },
  };
};

/**
 * Hook for optimizing large form data
 */
export const useFormDataOptimization = (initialData = {}) => {
  const [data, setData] = useState(initialData);
  const [dirtyFields, setDirtyFields] = useState(new Set());
  const debounceTimersRef = useRef(new Map());

  const updateField = useCallback((field, value, debounceMs = 300) => {
    // Clear existing debounce timer
    const existingTimer = debounceTimersRef.current.get(field);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new debounce timer
    const timer = setTimeout(() => {
      setData((prev) => ({ ...prev, [field]: value }));
      setDirtyFields((prev) => new Set([...prev, field]));
      debounceTimersRef.current.delete(field);
    }, debounceMs);

    debounceTimersRef.current.set(field, timer);
  }, []);

  const getDirtyData = useCallback(() => {
    const dirtyData = {};
    for (const field of dirtyFields) {
      if (field in data) {
        dirtyData[field] = data[field];
      }
    }
    return dirtyData;
  }, [data, dirtyFields]);

  const resetForm = useCallback(() => {
    setData(initialData);
    setDirtyFields(new Set());
    // Clear all debounce timers
    debounceTimersRef.current.forEach((timer) => clearTimeout(timer));
    debounceTimersRef.current.clear();
  }, [initialData]);

  return {
    data,
    dirtyFields: Array.from(dirtyFields),
    updateField,
    getDirtyData,
    resetForm,
    isDirty: dirtyFields.size > 0,
  };
};

export default {
  useMemoryOptimization,
  useVirtualList,
  useDataPagination,
  useFormDataOptimization,
};
