import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { BaseDesignTokens } from '../../../design-system/DesignTokens';

// Simple Table Component for displaying data
const SimpleTable = ({
  data = [],
  columns = [],
  onRowPress,
  variant = 'default',
  size = 'medium',
  therapeuticTheme,
  showHeader = true,
  striped = false,
  bordered = true,
  hoverable = false,
  sortable = false,
  onSort,
  sortColumn,
  sortDirection = 'asc',
  style,
  headerStyle,
  rowStyle,
  cellStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const tokens = BaseDesignTokens;

  const getColors = () => {
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return {
        headerBg: therapeuticColors?.[100] || tokens.colors.background.secondary,
        headerText: therapeuticColors?.[800] || tokens.colors.text.primary,
        rowBg: tokens.colors.background.primary,
        alternateRowBg: therapeuticColors?.[50] || tokens.colors.background.secondary,
        borderColor: therapeuticColors?.[200] || tokens.colors.border.primary,
        textColor: tokens.colors.text.primary,
        secondaryTextColor: tokens.colors.text.secondary,
      };
    }

    return {
      headerBg: tokens.colors.background.secondary,
      headerText: tokens.colors.text.primary,
      rowBg: tokens.colors.background.primary,
      alternateRowBg: tokens.colors.background.secondary,
      borderColor: tokens.colors.border.primary,
      textColor: tokens.colors.text.primary,
      secondaryTextColor: tokens.colors.text.secondary,
    };
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: tokens.spacing[2],
          paddingHorizontal: tokens.spacing[3],
          fontSize: tokens.typography.sizes.sm,
        };
      case 'large':
        return {
          paddingVertical: tokens.spacing[4],
          paddingHorizontal: tokens.spacing[5],
          fontSize: tokens.typography.sizes.lg,
        };
      default:
        return {
          paddingVertical: tokens.spacing[3],
          paddingHorizontal: tokens.spacing[4],
          fontSize: tokens.typography.sizes.base,
        };
    }
  };

  const colors = getColors();
  const sizeStyles = getSizeStyles();

  const handleSort = (columnKey) => {
    if (!sortable || !onSort) return;
    
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  const renderSortIndicator = (columnKey) => {
    if (!sortable || sortColumn !== columnKey) return null;
    
    return (
      <Text style={styles.sortIndicator}>
        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
      </Text>
    );
  };

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <View
        style={[
          styles.headerRow,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.borderColor,
            borderBottomWidth: bordered ? 1 : 0,
          },
          headerStyle,
        ]}
      >
        {columns.map((column, index) => (
          <TouchableOpacity
            key={column.key || index}
            style={[
              styles.headerCell,
              {
                paddingVertical: sizeStyles.paddingVertical,
                paddingHorizontal: sizeStyles.paddingHorizontal,
                flex: column.flex || 1,
                minWidth: column.width || 'auto',
                maxWidth: column.maxWidth || 'auto',
                borderRightColor: colors.borderColor,
                borderRightWidth: bordered && index < columns.length - 1 ? 1 : 0,
              },
            ]}
            onPress={() => handleSort(column.key)}
            disabled={!sortable}
            accessible={true}
            accessibilityRole="columnheader"
            accessibilityLabel={column.title}
          >
            <Text
              style={[
                styles.headerText,
                {
                  color: colors.headerText,
                  fontSize: sizeStyles.fontSize,
                  fontWeight: '600',
                  textAlign: column.align || 'left',
                },
              ]}
            >
              {column.title}
              {renderSortIndicator(column.key)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCell = (item, column, rowIndex, cellIndex) => {
    const cellValue = item[column.key];
    const isLastCell = cellIndex === columns.length - 1;

    let cellContent;
    if (column.render) {
      cellContent = column.render(cellValue, item, rowIndex);
    } else {
      cellContent = (
        <Text
          style={[
            styles.cellText,
            {
              color: colors.textColor,
              fontSize: sizeStyles.fontSize,
              textAlign: column.align || 'left',
            },
          ]}
          numberOfLines={column.numberOfLines || 1}
          ellipsizeMode={column.ellipsizeMode || 'tail'}
        >
          {cellValue !== null && cellValue !== undefined ? String(cellValue) : '—'}
        </Text>
      );
    }

    return (
      <View
        key={column.key || cellIndex}
        style={[
          styles.cell,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            flex: column.flex || 1,
            minWidth: column.width || 'auto',
            maxWidth: column.maxWidth || 'auto',
            borderRightColor: colors.borderColor,
            borderRightWidth: bordered && !isLastCell ? 1 : 0,
          },
          cellStyle,
        ]}
      >
        {cellContent}
      </View>
    );
  };

  const renderRow = (item, index) => {
    const isEvenRow = index % 2 === 0;
    const backgroundColor = striped && !isEvenRow 
      ? colors.alternateRowBg 
      : colors.rowBg;

    const RowComponent = onRowPress ? TouchableOpacity : View;
    const rowProps = onRowPress ? {
      onPress: () => onRowPress(item, index),
      activeOpacity: 0.7,
      accessible: true,
      accessibilityRole: 'button',
      accessibilityLabel: `Row ${index + 1}`,
    } : {};

    return (
      <RowComponent
        key={item.key || item.id || index}
        style={[
          styles.row,
          {
            backgroundColor,
            borderBottomColor: colors.borderColor,
            borderBottomWidth: bordered ? 1 : 0,
          },
          rowStyle,
        ]}
        {...rowProps}
      >
        {columns.map((column, cellIndex) => 
          renderCell(item, column, index, cellIndex)
        )}
      </RowComponent>
    );
  };

  const tableStyle = [
    styles.table,
    {
      borderColor: colors.borderColor,
      borderWidth: bordered ? 1 : 0,
      borderRadius: tokens.borderRadius.base,
    },
    style,
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      testID={testID || 'simple-table'}
    >
      <View style={tableStyle}>
        {renderHeader()}
        <ScrollView
          style={styles.tableBody}
          showsVerticalScrollIndicator={false}
        >
          {data.map((item, index) => renderRow(item, index))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  table: {
    minWidth: '100%',
    overflow: 'hidden',
  },
  tableBody: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCell: {
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '600',
    includeFontPadding: false,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  cell: {
    justifyContent: 'center',
  },
  cellText: {
    includeFontPadding: false,
  },
  sortIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

SimpleTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.number,
      maxWidth: PropTypes.number,
      flex: PropTypes.number,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      render: PropTypes.func,
      numberOfLines: PropTypes.number,
      ellipsizeMode: PropTypes.oneOf(['head', 'middle', 'tail', 'clip']),
    })
  ).isRequired,
  onRowPress: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'minimal', 'bordered']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  showHeader: PropTypes.bool,
  striped: PropTypes.bool,
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  sortable: PropTypes.bool,
  onSort: PropTypes.func,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  rowStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  cellStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default SimpleTable;