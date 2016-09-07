// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'ngCordovaOauth', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

})

//
.config(['$httpProvider', '$ionicConfigProvider', function($httpProvider, $ionicConfigProvider) {
  $httpProvider.defaults.headers.common["Content-Type"] = "multipart/form-data; charset=utf-8";
}])

.controller('CaptureCtrl', function($scope, $ionicActionSheet, $ionicLoading, $ionicPlatform, $cordovaCamera, $http, $cordovaFileTransfer, $cordovaOauth, $localStorage, $ionicModal) {
  
  $scope.send_draft = send_draft;
  //$scope.isAndroid = false;
  //check it an android phone or not 
  $scope.isAndroid = ionic.Platform.isAndroid();

  $ionicPlatform.ready(function() {
    var api_key = '1Zgwa3wEOuwkxlytkVqgh3sd';
    var auth = $cordovaOauth.google('233459199900-6cutei5k88gteieinm8uai3roll7nin8.apps.googleusercontent.com', ['https://www.googleapis.com/auth/gmail.compose']);
    auth.then(function(result) {
      console.log(result);
      var access_token = result.access_token;
      $localStorage.access_token = result.access_token;
      //$scope.showActionSheet();
    }, function(error) {
      console.log('error');
    });

    $scope.showActionSheet();
    $scope.showAnalyzeButton = false;
    $scope.imageData = '';
    var self = this;

    this.showLoading = function() {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
    };

    this.hideLoading = function() {
      $ionicLoading.hide();
    };

    this.getPicture = function(index) {

      var sourceType = index === 0 ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
          //var image = document.getElementById('pic');
          //image.src = imageData;
          $scope.imageData = imageData;
          showLoading();
          var server = 'http://bcr1.intsig.net/BCRService/BCR_VCF2?user=chacko@rawdatatech.com&pass=EHJSJCETKDG77J6Y&lang=1';
          var options = {
            fileKey: "upfile",
            filename: 'wwww123.jpeg',
            chunkedMode: true,
            mimeType: "image/jpeg"
          };
          var filePath = imageData;
          $cordovaFileTransfer.upload(server, filePath, options)
            .then(function(result) {
              // Success!
              //console.log('result', result);
              VCF.parse(result.response, function(vcard) {
                hideLoading();
                // this function is called with a VCard instance.
                // If the input contains more than one vCard, it is called multiple times.
                console.log("Formatted name", vcard.email[0].value);
                $scope.email_address = vcard.email[0].value;
                //console.log("Names", JSON.stringify(vcard.n));
                $scope.modal.show();
              });

            }, function(err) {
              // Error
              console.log('error', error);
            }, function(progress) {
              // constant progress updates
            });
          $scope.showAnalyzeButton = true;
        },
        function(err) {
          console.log(err);
          $scope.showActionSheet();
        });

    };

  });

  $scope.showActionSheet = function() {
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: '<i class="icon ion-ios-camera balanced"></i> Choose Photo'
      }, {
        text: '<i class="icon ion-briefcase assertive"></i> Take Photo'
      }],
      cancelText: 'Cancel',
      cancel: function() {
        console.log('cancel');
      },
      buttonClicked: function(index) {
        getPicture(index);
        return true;
      }
    });
  };

  $ionicModal.fromTemplateUrl('modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  function send_draft() {
    var message_body = "To: " + $scope.email_address + "\r\nSubject: my subject\r\n\r\nBody goes here";
    $http.post('https://www.googleapis.com/gmail/v1/users/me/drafts?fields=message&access_token=' + $localStorage.access_token, {
      'message': {
        'raw': btoa(message_body)
      }
    }).then(function(result) {
      console.log(result);
      //$scope.modal.hide();
    }, function(error) {
      alert('error');
      console.log(error);
    });
  }

});