angular.module('starter.camera', [])

.factory('Camera', function($q) {

   return {
      getPicture: function(options) {
         var q = $q.defer();
         console.log('wer')
         console.log(navigator);
         /*navigator.camera.getPicture(function(result) {
            //console.log('result', result);
            q.resolve(result);
         }, function(err) {
            q.reject(err);
         }, options);
*/
         return q.promise;
      }
   }

});