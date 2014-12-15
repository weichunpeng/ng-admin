/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var UpdateQueries = require('ng-admin/Crud/repository/UpdateQueries'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: UpdateQueries", function () {

        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop,
                    getRouteFor: function (view, identyId) {
                        return 'http://localhost/' + view.getEntity().name() + (identyId ? '/' + identyId : '');
                    }
                };
            };

            entity = new Entity('cat');
            view = entity.creationView()
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'))
                .extraParams(null)
                .interceptor(null);
        });

        describe("updateOne", function () {

            it('should PUT an entity when calling updateOne', function () {
                var updateQueries = new UpdateQueries({}, Restangular, config),
                    rawEntity = {id: 3, name: 'Mizu'};

                Restangular.customPUT = jasmine.createSpy('customPUT').andReturn(mixins.buildPromise({data: rawEntity}));

                updateQueries.updateOne(view, rawEntity)
                    .then(function (entry) {
                        expect(Restangular.oneUrl).toHaveBeenCalledWith('myView', 'http://localhost/cat/3');
                        expect(Restangular.customPUT).toHaveBeenCalledWith(rawEntity, null, null, {});
                        expect(entry.values.name).toEqual('Mizu');
                    });
            });
        });
    });
});
