goog.module('one.two.SomeModule');

const Foo = goog.require('one.two.Foo');
const Bar = goog.require('one.two.Bar');
const Baz = goog.require('one.two.Baz');

const SomeModule = angular.module('one.two.SomeModule', [
    Foo.name,
    Bar.name,
    Baz.name
]);

exports = SomeModule;
