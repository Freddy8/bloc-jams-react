import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      maxVolume: 100,
      currentVolume: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      hover: false
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true});
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration
        });
      },
      volumeupdate: e => {
       this.setState({
         currentVolume: this.audioElement.currentVolume
       });
     },
     volumechange: e => {
       this.setState({
         maxVolume: this.audioElement.maxVolume
       });
     }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumeupdate', this.eventListeners.volumeupdate);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumeupdate', this.eventListeners.volumeupdate);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause(song);
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play(song);
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex -1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleNextClick() {
    const index = this.state.album.songs.length;
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(index -1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  formatTime(time) {
    let mins = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    let format = mins + ":" + sec;
    if (sec < 10) {
      format = mins + ":0" + sec;
    }
    return format;
  }

  handleVolumeChange(e) {
    this.audioElement.volume = e.target.value;
    this.setState({
      currentVolume: e.target.value
    });
  }


	mouseHoverYes(song){
		this.setState( {hover: song});
	}

	mouseHoverNo(song){
			this.setState( {hover: false});
	}

	onEnter(song, index){
		if (this.state.hover !== song) {
			return <td className="song-number">{index + 1}</td>
		}
		if (this.state.isPlaying && this.state.currentSong === song){
			return <td className="ion-pause"></td>
		}
		if (!this.state.isPlaying && this.state.currentSong === song) {
			return <td className="ion-play"></td>
		}

		else {
			return <td className="ion-play"></td>
		}
	}

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img alt="album-art" id="album-cover-art" src={this.state.album.albumCover} />
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo} </div>
          </div>
        </section>
        <table id="song-list">
          <colgroup className= {this.state.isPlaying ? 'playing' : 'paused'}>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            {
              this.state.album.songs.map((song, index) =>
			  	      <tr className="song" key={index}
			  	      onClick={() => this.handleSongClick(song)}
			  	      onMouseEnter={() => this.mouseHoverYes(song)}
			  	      onMouseLeave={() => this.mouseHoverNo(song)} >

                {this.onEnter(song,index)}
                <td className="song-title">{song.title}</td>
                <td className="song-duration">{this.formatTime(song.duration)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <PlayerBar
          isplaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          currentVolume={this.audioElement.currentVolume}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={(time) => this.formatTime(time)}
        />
      </section>
    );
  }
}

export default Album;
