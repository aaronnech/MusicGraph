var vm = new AppViewModel();

vm.nodes.subscribe(function (newValue) {
    updateD3(newValue);
    // Dispose any existing subscriptions
    ko.utils.arrayForEach(subs, function (sub) { sub.dispose(); });
    // And create new ones...
    ko.utils.arrayForEach(newValue, function (item) {
        subs.push(item.toD3.subscribe(function () {
            updateD3(newValue);
        }));
    });
});

ko.applyBindings(vm);