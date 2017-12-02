import React from 'react';
import { Text, View, WebView } from 'react-native';
import moment from 'moment';
import styles from './styles';


export default class VideoWebView extends React.Component {

    render() {
      const { video } = this.props.navigation.state.params
      const pubDate = moment(video.publishedAt).fromNow(false);

        return (
            <View style={styles.container}>
                <Text style={[styles.noResultsText, styles.centerText]}>
                {pubDate} via {video.channelTitle} | {video.stats.viewCount} views
                </Text>
                <WebView
                    style={styles.frame}
                    source={{uri:`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}}
                    renderLoading={this.renderLoading}
                    renderError={this.renderError}
                    automaticallyAdjustContentInsets={false}
                />
            </View>
        );
    }
    
    renderLoading () {
        return (
            <View style={[styles.container, styles.centerText]}>
                <Text style={styles.noResultsText}>Loading video...</Text>
            </View>
        );
    }
    
    renderError () {
        return (
            <View style={[styles.container, styles.centerText]}>
                <Text style={styles.noResultsText}>Video not found - 404, {this.props.url}</Text>
            </View>
        );
    }
}
