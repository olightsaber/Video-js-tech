var options = {
  preload: 'auto',
  controls: false,
  autoplay: 'muted',
  width: '640px',
  crossorigin: "anonymous",
  // playbackRates: [1, 1.25, 1.5, 2],
  fluid: false, // contain with its parent
  // navigationUI: 'hide',
  // aspectRatio: "16:9",
  // nativeControlsForTouch: true,
  // resizeManager: {
  //   ResizeObserver: null
  // },
  controlBar: {
    playToggle: {
      replay: true
    },
    volumePanel: {
      inline: true
    },
    // fullscreenToggle: true,
    // playToggle: false,
    // captionsButton: false,
    // chaptersButton: false,            
    // subtitlesButton: false,
    // remainingTimeDisplay: false,
    // progressControl: {
    //   seekBar: true
    // },
    // fullscreenToggle: false,
    // playbackRateMenuButton: false,
  }
  // userActions: {
    // hotkeys: {
    //   muteKey: function(event) {
    //     // disable mute key
    //     console.log('muted');
    //   },
    //   fullscreenKey: function(event) {
    //     // override fullscreen to trigger when pressing the v key
    //     console.log('fullscreen');
    //     return (event.which === 86);
    //   }
    // }
  // }
};

// INITIALIZE PLAYER
var player = videojs('my-player', options)

// set playlist 
var samplePlaylist = [
  // {
  //   sources: [{
  //       src: "//vjs.zencdn.net/v/oceans.mp4",
  //       type: "video/mp4"
  //   }],
  //   poster: "",
  //   textTracks:[{label: "Englesh", src:"captions.vtt", default: true }]
  // },
  {
    sources: [{
      src: "./video/SampleVideo_1280x720_2mb.mp4",
      type: "video/mp4"
    }],
    poster: "",
    // thumbnail: [{
    //   srcset: 'oceans.jpg',
    //   type: 'image/jpeg',
    //   media: '(min-width: 400px;)'
    // }],
    textTracks:[{label: "French", src:"captions2.vtt", default: true }]
  },
  {
    sources: [{
      src: "./video/video_preview_h264.mp4",
      type: "video/mp4"
    }],
    poster: "",
    textTracks:[{label: "Englesh", src:"captions.vtt", default: true }]
  },
  {
    sources: [{
      src: "//vjs.zencdn.net/v/oceans.mp4",
      type: "video/mp4"
    }],
    poster: "",
    // thumbnail: [{
    //   srcset: 'oceans.jpg',
    //   type: 'image/jpeg',
    //   media: '(min-width: 400px;)'
    // }],
    textTracks:[{label: "French", src:"captions2.vtt", default: true }]
  }
]

// set up playlist
player.playlist(samplePlaylist)

// Play through the playlist automatically.
// player.playlist.autoadvance(0)

// Set all surface of player beside menu as play/pause toggle button
let videoPlayer = document.querySelector('#my-player_html5_api')
player.on('click', () => {
  player.paused()
    ? player.play() 
    : player.pause()
})

// button example
// var Button = videojs.getComponent('Button');
// var button = new Button(player, {
//   clickHandler: function(event) {
//     videojs.log('Clicked');
//   }
// });

// clickable component
// var ClickableComponent = videojs.getComponent('ClickableComponent');
// var oneButton = new ClickableComponent(player, {
//   clickHandler: function(event) {
//     videojs.log('Clicked');
//   }
// });

// console.log(oneButton);

// player.addChild(oneButton)

// var test = new ClickableComponent(player)
// var CloseButton = videojs.getComponent('CloseButton')
// var close = new CloseButton(player)

// console.log(test, 'test');

// Get the Component base class from Video.js
var Component = videojs.getComponent('Component');

// Get all text tracks for the current player.
var tracks = player.textTracks();

// The videojs.extend function can be used instead of ES6 classes.
var ClickableComponent = videojs.getComponent('ClickableComponent');
var CueButton = new ClickableComponent(player, {
  clickHandler: function() {
    // cek if cue active, then toggle between disabled and showing
    tracks[0].mode == 'disabled' 
      ? tracks[0].mode = 'showing'
      : tracks[0].mode = 'disabled'
  },
  controlText: 'CC',
  className: 'vjs-cue-button'
})

// Register the component with Video.js, so it can be used in players.
// videojs.registerComponent('CueButton', CueButton);

// Add the TitleBar as a child of the player and provide it some text in its options.
player.addChild(CueButton)

// ERROR HANDLER
videojs.hook('error', function(player, err) {
  console.log(`player ${player.id()} has errored out with code ${err.code} ${err.message}`);
});

// Button Component for choices video
var Button = videojs.getComponent('Button');
var testButton1 = new Button(player, {
  className: 'vjs-dialog-choose-1 vjs-visible-text',
  controlText: 'Choose 1',
  clickHandler: function(event) {
    videojs.log('Clicked 1');
    player.playlist.next();
    // need to manually change index playlist video
    console.log(player.playlist.currentItem(), 1);
    modal.close()
  }
});

var testButton2 = new Button(player, {
  className: 'vjs-dialog-choose-2 vjs-visible-text',
  controlText: 'Choose 2',
  clickHandler: function(event) {
    videojs.log('Clicked 2');
    player.playlist.previous();
    modal.close()
  }
});

var ModalDialog = videojs.getComponent('ModalDialog');

var modal = new ModalDialog(player, {
  pauseOnOpen: true,
  // We don't want this modal to go away when it closes.
  // fillAlways: true,
  
  temporary: false, // If true, the modal can only be opened once; it will be disposed as soon as it's closed.
  uncloseable: true,
  label: 'Kamu pilih yang mana?',
  className: 'vjs-modal-dialog-btn-1 vjs-visible-text'
});

player.addChild(modal);

// player.on('play', function() {
//   modal.close();
//   if (tracks[0]) if (tracks[0].mode = 'disabled') return tracks[0].mode = 'showing'
// });

// player.on('pause', function() {
//   // if (player.currentTime() == player.duration()) {
//     modal.open()
//     modal.addChild(testButton1)
//     modal.addChild(testButton2)
//     console.log(player, 'paused');
//     // when modal open disabled subtitles
//   // }

//   if (tracks[0].mode = 'showing') return tracks[0].mode = 'disabled'
// })

player.on('ended', () => {
  if (player.playlist.lastIndex() == player.playlist.currentIndex()) {
    if (modal.open()) {
      modal.close()
    }
  } else {
    modal.open()
    modal.addChild(testButton1)
    modal.addChild(testButton2)
  }
  if (tracks[0].mode = 'showing') tracks[0].mode = 'disabled'
})

modal.on('modalclose', () => {
  player.play()
})


// var captionButton = new Button(player, {
//   controlText: 'CC',
//   className: 'vjs-custom-captions-button vjs-visible-text vjs-button',
//   clickHandler: function(event) {
    
//     // videojs.log(tracks[0])
    
//     tracks[0].mode == 'disabled' 
//       ? tracks[0].mode = 'showing'
//       : tracks[0].mode = 'disabled'
//   }
// })

// player.addChild(captionButton)

// var myComponent = new Component(player);
// var myButton = myComponent.addChild('MyButton', {
//   text: 'Press Me',
//   buttonChildExample: {
//     buttonChildOption: true
//   }
// });

// player.addChild(myComponent)