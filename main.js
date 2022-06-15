var options = {
  preload: 'auto',
  controls: false,
  autoplay: 'muted',
  crossorigin: "anonymous",
  fluid: true, // contain with its parent
  // aspectRatio: "16:9",
  fullscreen: {
    options: {navigationUI: 'hide'}
  }
};

// INITIALIZE PLAYER
var player = videojs('my-player', options)

// set playlist 
var samplePlaylist = [
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
    textTracks:[{label: "French", src:"captions-1.vtt", manualCleanup: false, default: true }]
  },
  {
    sources: [{
      src: "./video/video_preview_h264.mp4",
      type: "video/mp4"
    }],
    poster: "",
    textTracks:[{label: "English", src:"captions-2.vtt", manualCleanup: false, default: true }]
  },
  {
    sources: [{
      src: "//vjs.zencdn.net/v/oceans.mp4",
      type: "video/mp4"
    }],
    poster: "",
    textTracks:[{label: "French", src:"captions-3.vtt", manualCleanup: false, default: true }]
  }
]

// set up playlist
player.playlist(samplePlaylist)

// Play through the playlist automatically.
// player.playlist.autoadvance(0)

// Set all surface of player beside menu as play/pause toggle button
let videoPlayer = document.querySelector('#my-player_html5_api')
// player.on('click', () => {
//   player.paused()
//     ? player.play() 
//     : player.pause()
// })

// var test = new ClickableComponent(player)
// var CloseButton = videojs.getComponent('CloseButton')
// var close = new CloseButton(player)

// Get the Component base class from Video.js
var Component = videojs.getComponent('Component');

// Get all text tracks for the current player.
var tracks = player.textTracks();

// The videojs.extend function can be used instead of ES6 classes.
var ClickableComponent = videojs.getComponent('ClickableComponent');
var CueButton = new ClickableComponent(player, {
  className: 'vjs-cue-button vjs-cue-on',
  clickHandler: function() {
    // cek if cue active, then toggle between disabled and showing
    tracks[0].mode == 'disabled' 
      ? tracks[0].mode = 'showing'
      : tracks[0].mode = 'disabled'

    let el = videojs.dom.$(".vjs-cue-on")
    
    if (videojs.dom.hasClass(el, "vjs-cue-on")) {
      videojs.dom.toggleClass(el, "vjs-cue-off")
    } else {
      videojs.dom.toggleClass(el, "vjs-cue-on")
    }

    // to make player still playin when component clicked
    player.on('paused', () => {
      player.play()
    })
  },
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
    player.playlist.next();
    modal.close()
  }
});

var testButton2 = new Button(player, {
  className: 'vjs-dialog-choose-2 vjs-visible-text',
  controlText: 'Choose 2',
  clickHandler: function(event) {
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

// When player end, cek if video are the last on index, if so turn off modal
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
  
  // when player ended close subtitle
  if (tracks[0].mode == 'showing') {
    tracks[0].mode = 'disabled'
  }
})

player.on('play', () => {
  if (tracks[0].mode == 'disabled') {
    tracks[0].mode = 'showing'
  }
})

modal.on('modalclose', () => {
  // set cc on after user close modal or next video
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