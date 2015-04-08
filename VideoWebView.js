'use strict';

var React = require('react-native');

var {
    Text,
    StyleSheet,
    View,
    WebView,
    } = React;

var ViewVideo = React.createClass({
    render: function() {
        //console.log('### VIDEOS::', React.VIDEOS);
        return (
            <View style={styles.container}>
                <WebView url={this.props.url}
                    renderLoading={this.renderLoading}
                    renderError={this.renderError} />
            </View>
        );
    },
    renderLoading: function () {
        console.log('## webvew: renderloading()');
    },
    renderError: function () {
        console.log('## webvew: rendererror()');
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6EF',
        flexDirection: 'column'
    }
});

module.exports = ViewVideo;
