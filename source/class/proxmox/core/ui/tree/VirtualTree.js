qx.Class.define("proxmox.core.ui.tree.VirtualTree", {
    extend: qx.ui.tree.VirtualTree,

    members: {
        /**
         * Saves the tree state (open nodes + selected node).
         *
         * @param idProperty Property that identifies a tree node.
         *
         * @return {Object} object with a "open" array and a "selected" property.
         */
        getTreeState: function(idProperty) {
            var result = {open: [], selected: null};
            var open = result.open;
            this.getOpenNodes().forEach((node) => {
                open.push(node.get(idProperty));
            });

            this.getSelection().forEach((node) => {
                result.selected = node.get(idProperty);
            });

            return result;
        },

        /**
         * Restores the tree state from the getTreeState results.
         *
         * @param idProperty Property that identifies a tree node.
         * @param state State result from {proxmox.core.ui.Tree.getTreeState}
         */
        restoreTreeState: function(idProperty, state) {
            var table = this.getLookupTable();
            table.forEach((node) => {
                var id = node.get(idProperty);
                if (state.open.includes(id)) {
                    this.openNode(node);
                }
                if (id == state.selected) {
                    // TODO: openNodeAndParents doesnt work.
                    this.openNodeAndParents(node);
                    this.getSelection().push(node);
                }
            });
        }
    }
});