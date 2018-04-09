/**
 * getTableState and restoreColumnState from:
 *  http://www.smorgasbork.com/2013/09/30/saving-and-restoring-qooxdoo-table-column-sizes-visibility-and-order/
 */

qx.Class.define("p.ui.table.Table", {
    extend: qx.ui.table.Table,

    members: {
        __restoringColumnState: false,

        getColumnState: function() {
            if (this.__restoringColumnState) {
                return;
            }

            var tcm = this.getTableColumnModel();

            var num_cols = tcm.getOverallColumnCount();

            var hidden_cols = [];

            var state = {};
            state.col_widths = [];
            state.col_visible = [];
            for (var i = 0; i < num_cols; i++)
            {
                state.col_visible.push (tcm.isColumnVisible (i) ? 1 : 0);
                state.col_widths.push (tcm.getColumnWidth (i));

                if (!tcm.isColumnVisible (i))
                {
                    hidden_cols.push (i);
                }

            }
            var vis_cols = tcm.getVisibleColumns();

            state.col_order = [];

            for (var i = 0; i < vis_cols.length; i++) {
                state.col_order.push (vis_cols[i]);
            }

            for (var i = 0; i < hidden_cols.length; i++) {
                state.col_order.push (hidden_cols[i]);
            }

            var tm = this.getTableModel();
            state.sortIndex = tm.getSortColumnIndex();
            state.sortAscending = tm.isSortAscending();

            return state;
        },

        restoreColumnState: function(state) {
            if (state === null) {
                return;
            }

            this.__restoringColumnState = true;

            var tcm = this.getTableColumnModel ();
            var num_cols = tcm.getOverallColumnCount();

            // if the application code has changed and the number of columns is different since
            // the time we saved the cookie, just ignore the cookie
            if (state.col_order.length != num_cols) {
                return;
            }
            tcm.setColumnsOrder(state.col_order);

            for (var i = 0; i < num_cols; i++)
            {
                tcm.setColumnVisible(i, (state.col_visible[i] == 1));
                tcm.setColumnWidth(i, state.col_widths[i]);
            }

            var tm = this.getTableModel();
            tm.sortByColumn(state.sortIndex, state.sortAscending);

            this.__restoringColumnState = false;
        },
    }
});