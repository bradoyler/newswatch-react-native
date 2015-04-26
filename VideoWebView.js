'use strict';

var moment = require('moment');

var React = require('react-native');

var {
    Text,
    StyleSheet,
    View,
    WebView,
    } = React;

var ViewVideo = React.createClass({

    getInitialState: function() {
        return {
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
        };
    },

    render: function() {
        var pubDate = moment(this.props.video.publishedAt).fromNow(false);

        return (
            <View style={styles.container}>
                <Text style={[styles.noResultsText, styles.centerText]}>
                {pubDate} via {this.props.video.channelTitle} | {this.props.video.stats.viewCount} views
                </Text>
                <WebView
                    style={styles.frame}
                    url={this.props.url}
                    renderLoading={this.renderLoading}
                    renderError={this.renderError}
                    automaticallyAdjustContentInsets={false}
                />
            </View>
        );
    },
    renderLoading: function () {
        console.log('## webView: loading()');
        return (
            <View style={[styles.container, styles.centerText]}>
                <Text style={styles.noResultsText}>Loading video...</Text>
            </View>
        );
    },
    renderError: function () {
        return (
            <View style={[styles.container, styles.centerText]}>
                <Text style={styles.noResultsText}>Video not found - 404, {this.props.url}</Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cccccc',
        flexDirection: 'column'
    },
    centerText: {
        marginBottom:5,
        textAlign: 'center',
    },
    noResultsText: {
        marginTop: 70,
        marginBottom:0,
        color: '#000000',
    },
    frame: {
        marginTop:0
    }
});

module.exports = ViewVideo;
