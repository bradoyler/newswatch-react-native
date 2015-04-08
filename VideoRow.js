'use strict';

var React = require('react-native');
var {
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
    } = React;

var getImageSource = require('./getImageSource');

var VideoRow = React.createClass({
    render: function() {
        var viewCount = this.props.video.stats.viewCount;
        var channelTitle = this.props.video.channelTitle;
        var title = this.props.video.title;
        return (
            <View>
                <TouchableHighlight onPress={this.props.onSelect}>
                    <View style={styles.row}>
                        <Image
                            source={getImageSource(this.props.video, 'default')}
                            style={styles.cellImage}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.title} numberOfLines={2}>{title}</Text>
                            <Text style={styles.channel} numberOfLines={1}>
                                {channelTitle} {' '}&bull;{' '} {viewCount} views
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
                <View style={styles.cellBorder} />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    textContainer: {
        flex: 1,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    channel: {
        color: '#999999',
        fontSize: 12,
    },
    row: {
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 5,
    },
    cellImage: {
        backgroundColor: '#dddddd',
        height: 93,
        marginRight: 10,
        width: 60,
    },
    cellBorder: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        // Trick to get the thinest line the device can display
        height: 1 / PixelRatio.get(),
        marginLeft: 4,
    },
});

module.exports = VideoRow;
