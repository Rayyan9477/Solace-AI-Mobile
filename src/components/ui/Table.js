import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { MentalHealthIcon } from "../icons";

const TableCell = ({
  children,
  style,
  align = "left",
  width,
  onPress,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  const cellContent = (
    <View
      style={[
        styles.cell,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.secondary,
          width,
          justifyContent:
            align === "center"
              ? "center"
              : align === "right"
                ? "flex-end"
                : "flex-start",
        },
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.cellText,
            {
              color: theme.colors.text.primary,
              textAlign: align,
            },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {cellContent}
      </TouchableOpacity>
    );
  }

  return cellContent;
};

const TableHeader = ({ columns = [], sortConfig, onSort }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.headerRow}>
      {columns.map((column, index) => (
        <TableCell
          key={column.key || index}
          style={[
            styles.headerCell,
            { backgroundColor: theme.colors.therapeutic.peaceful[50] },
          ]}
          width={column.width}
          align={column.align}
          onPress={column.sortable ? () => onSort(column.key) : undefined}
          accessibilityLabel={
            column.sortable ? `Sort by ${column.title}` : column.title
          }
        >
          <View style={styles.headerContent}>
            <Text
              style={[styles.headerText, { color: theme.colors.text.primary }]}
            >
              {column.title}
            </Text>

            {column.sortable && (
              <View style={styles.sortIcon}>
                <MentalHealthIcon
                  name="Brain"
                  size={12}
                  color={
                    sortConfig?.key === column.key
                      ? theme.colors.therapeutic.calming[500]
                      : theme.colors.text.tertiary
                  }
                  variant={
                    sortConfig?.key === column.key ? "filled" : "outline"
                  }
                />
              </View>
            )}
          </View>
        </TableCell>
      ))}
    </View>
  );
};

const TableRow = ({
  data = {},
  columns = [],
  index,
  onRowPress,
  selected = false,
}) => {
  const { theme } = useTheme();

  const rowContent = (
    <View
      style={[
        styles.row,
        {
          backgroundColor: selected
            ? theme.colors.therapeutic.calming[50]
            : index % 2 === 0
              ? theme.colors.background.card
              : theme.colors.background.secondary,
        },
      ]}
    >
      {columns.map((column, colIndex) => (
        <TableCell
          key={`${index}-${column.key || colIndex}`}
          width={column.width}
          align={column.align}
          style={styles.bodyCell}
        >
          {column.render
            ? column.render(data[column.key], data, index)
            : data[column.key] || "-"}
        </TableCell>
      ))}
    </View>
  );

  if (onRowPress) {
    return (
      <TouchableOpacity
        onPress={() => onRowPress(data, index)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Row ${index + 1}`}
      >
        {rowContent}
      </TouchableOpacity>
    );
  }

  return rowContent;
};

const Table = ({
  data = [],
  columns = [],
  sortable = false,
  striped = true,
  onRowPress,
  selectedRows = [],
  emptyMessage = "No data available",
  loading = false,
  maxHeight,
  accessibilityLabel = "Data table",
}) => {
  const { theme } = useTheme();
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MentalHealthIcon
        name="Brain"
        size={48}
        color={theme.colors.text.tertiary}
        variant="outline"
      />
      <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
        {emptyMessage}
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <MentalHealthIcon
        name="Heart"
        size={24}
        color={theme.colors.therapeutic.calming[500]}
        variant="filled"
      />
      <Text
        style={[styles.loadingText, { color: theme.colors.text.secondary }]}
      >
        Loading...
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.card,
          borderColor: theme.colors.border.primary,
        },
      ]}
      accessibilityRole="table"
      accessibilityLabel={accessibilityLabel}
    >
      {/* Table Header */}
      <TableHeader
        columns={columns}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {/* Table Body */}
      <ScrollView
        style={[styles.tableBody, maxHeight && { maxHeight }]}
        showsVerticalScrollIndicator
      >
        {loading
          ? renderLoadingState()
          : sortedData.length === 0
            ? renderEmptyState()
            : sortedData.map((rowData, index) => (
                <TableRow
                  key={rowData.id || index}
                  data={rowData}
                  columns={columns}
                  index={index}
                  onRowPress={onRowPress}
                  selected={selectedRows.includes(rowData.id || index)}
                />
              ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
  },
  headerCell: {
    borderBottomWidth: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontWeight: "600",
    fontSize: 14,
  },
  sortIcon: {
    marginLeft: 4,
  },
  tableBody: {
    maxHeight: 400,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    minHeight: 44,
    justifyContent: "center",
  },
  bodyCell: {
    // Specific styles for body cells if needed
  },
  cellText: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    flexDirection: "row",
  },
  loadingText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export { TableCell, TableHeader, TableRow };
export default Table;
