angular.module('resourceApp', ['ngResource'])
    .factory("peernames", function ($resource) {
        return $resource(
            "/peernames.json", 
            {},
            {
                saveData: {
                    method: 'POST',
                    isArray: true
                }
            });
    })    
    .controller('resourceListController', function ($scope, peernames) {
        var resourceList = this;
        resourceList.name = '';
        resourceList.target = '';

        peernames.query(function (peers) {
            resourceList.resources = peers;
        });

        resourceList.addResource = function () {
            if ((resourceList.name != '') && (resourceList.target != '')) {
                resourceList.resources.push({
                    name: resourceList.name, 
                    target: resourceList.target,
                    variants: [
                      resourceList.name.toLowerCase()
                    ]
                });
                resourceList.name = '';
                resourceList.target = '';
            }
        };

        resourceList.deleteResource = function (resourceIndex) {
            if (confirm("Delete resource?")) {
                resourceList.resources.splice(resourceIndex, 1);                
            }            
        };

        resourceList.addVariant = function (resourceIndex) {
            var newVariant = resourceList.newVariant[resourceIndex].toLowerCase();
            resourceList.resources[resourceIndex].variants.push(newVariant);
            resourceList.newVariant[resourceIndex] = '';
        };

        resourceList.deleteVariant = function (resourceIndex, variantIndex) {
            if (confirm("Delete variant?")) {
                resourceList.resources[resourceIndex].variants.splice(variantIndex, 1);                
            }
        };

        resourceList.save = function () {
            peernames.saveData({}, resourceList.resources, function () {
                peernames.query(function (peers) {
                    resourceList.resources = peers;
                });
            });
        };
        
    });