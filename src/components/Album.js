import React, { Component } from 'react';
import albumData from './../data/albums';

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

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  mouseHoverYes(song){
    this.setState( {hover: song});
  }

  mouseHoverNo(song){
    this.setState( {hover: false});
  }

  onEnter(song, index){
    if (this.state.isPlaying && this.state.currentSong === song){
      return <td className='ion-pause'></td>
    }
    if (!this.state.isPlaying && this.state.currentSong === song) {
      return <td className="ion-play"></td>
    }
    if(this.state.hover !== song) {
      return <td className="song-number">{index + 1}</td>
    }
    else {
      return <td className="ion-play"></td>
    }
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
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
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
                <td className="song-duration">{song.duration}</td>
              </tr>
            )
          }
          </tbody>
        </table>
      </section>
    );
  }
}

export default Album;
