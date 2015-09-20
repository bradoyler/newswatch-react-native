'use strict';

var React = require('react-native');
var {
    ActivityIndicatorIOS,
    ListView,
    StyleSheet,
    Text,
    TextInput,
    View,
    } = React;
var TimerMixin = require('react-timer-mixin');

var VideoRow = require('./VideoRow');
var VideoWebView = require('./VideoWebView');

var youtubeChannel = {
    devKey: "AIzaSyBIv0VR7jqqTSWtVUKRWdnGVLClMaP2OsY",
    playlists: [
        {id: "PLUG0dgd8xRox0HUkTkB1GRuUQ8UF4bKw9", slug: "nation"},
        {id: "PLUG0dgd8xRowNDiWD8Gm2DbSSLYRU2GU1", slug: "business"},
        {id: "PLUG0dgd8xRowfHi0tmex0wNphaZWxXbeb", slug: "technology"},
        {id: "PLUG0dgd8xRowfHi0tmex0wNphaZWxXbeb", slug: "science"},
        {id: "PLUG0dgd8xRowrmQgoUg5vqe6Nx6uqZG0X", slug: "entertainment"},
        {id: "PLUG0dgd8xRownUauz1bPmWm-_0AWZZt7C", slug: "politics"},
        {id: "PLUG0dgd8xRoySqb3vR1Hp5ZPSfSec_VjY", slug: "world"}
    ]
};

var BASE_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?key='+
    youtubeChannel.devKey+'&part=snippet&maxResults=18&playlistId=';

var resultsCache = {
    dataForQuery: {},
    totalForQuery: {},
    timeForQuery:{}
};

var baseDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var MainScreen = React.createClass({
    mixins: [TimerMixin],
    timeoutID: (null: any),

getInitialState: function() {
    return {
        isLoading: true,
        dataSource: baseDataSource,
        filter: 'nation',
    };
},

componentDidMount: function() {
    var _filter = this.props.filter || this.state.filter;
    this.fetchVideos(_filter);
},

fetchVideos: function(query: string) {

    this.timeoutID = null;
    this.setState({isLoading: true, filter:query});

    var expiry = 1 * 60 * 1000; // cache expiration
    if(resultsCache.timeForQuery[query] + expiry > new Date().getTime()) {
        this.setState({
            isLoading: false,
            dataSource: baseDataSource.cloneWithRows(resultsCache.dataForQuery[query])
        });
        return;
    }

    var playlist = youtubeChannel.playlists.filter(function (item) {
            return (item.slug === query);
        })[0] || youtubeChannel.playlists[0];

    var ytPlaylistItemUrl = BASE_URL + playlist.id;
    fetch(ytPlaylistItemUrl)
        .then((response) => response.json())
        .catch((error) => {
            console.log('## error for: '+ query);
            var availableData =  resultsCache.dataForQuery[query] || [];

            this.setState({
                dataSource: baseDataSource.cloneWithRows(availableData),
                isLoading: false,
            });
        })
        .then((responseData) => {

            if(!responseData || !responseData.items){ // abort when no videos
                return console.log('### no responseData');
            }

            responseData.videos = responseData.items.map(function (item) {
                return {
                    videoId: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnails: item.snippet.thumbnails,
                    publishedAt: item.snippet.publishedAt
                }
            });

            console.log('## fetched', responseData.videos.length, query);

            resultsCache.totalForQuery[query] = responseData.videos.length;
            resultsCache.dataForQuery[query] = responseData.videos;
            resultsCache.timeForQuery[query] = new Date().getTime();

            this.setState({
                isLoading: false,
                dataSource: baseDataSource.cloneWithRows(resultsCache.dataForQuery[query]),
            });
        })
        .done();
},

selectVideo: function(video: Object) {

    var domain = 'https://www.youtube.com';
    this.props.navigator.push({
        title: video.title,
        component: VideoWebView,
        passProps: {
            video: video,
            url: domain +'/embed/'+ video.videoId +'?autoplay=1' // domain+'/watch?v='+video.videoId
        }
    });
},

handleScroll: function(event: Object) {

    if (event.nativeEvent.contentOffset.y < -110) { // pull-down
        this.setState({isLoading: true});
        var filter = this.props.filter || this.state.filter;
        // reduce dup fetches
        this.clearTimeout(this.timeoutID);
        this.timeoutID = this.setTimeout(() => this.fetchVideos(filter), 250);
    }
},

render: function() {

    var results = this.state.dataSource.getRowCount() === 0 ?
        <NoVideos
            filter={this.state.filter}
            isLoading={this.state.isLoading}
        /> :
        <ListView
            ref="listview"
            dataSource={this.state.dataSource}
            renderHeader={this.renderHeader}
            renderRow={this.renderRow}
            initialListSize={8}
            pageSize={8}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="onDrag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            onScroll={this.handleScroll}
        />;

        return (
            <View style={styles.container}>
                <View style={[styles.separator, {marginTop: 64}]} />
                {results}
            </View>
        );
},

renderRow: function(video: Object)  {
    return (
        <VideoRow
            onSelect={() => this.selectVideo(video)}
            video={video}
        />
    );
},

renderHeader: function () {
    if (this.state.isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicatorIOS
                    animating={this.state.isLoading}
                    style={[{marginTop: 10}]}
                />
            </View>
        );
    }
},

});

var NoVideos = React.createClass({
    render: function() {
        var text = 'no results found';
        if (this.props.filter) {
            if(this.props.isLoading){
                text = `Loading results for “${this.props.filter}”`;
            }
            else {
                text = `No results for “${this.props.filter}”`;
            }
        }

        return (
            <View style={[styles.container, styles.centerText]}>
                <Text style={styles.noResultsText}>{text}</Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    centerText: {
        alignItems: 'center',
    },
    noResultsText: {
        marginTop: 80,
        color: '#888888',
    },
    separator: {
        height: 1,
        backgroundColor: '#eeeeee',
    },
    spinner: {
        width: 30,
    },
    scrollSpinner: {
        marginVertical: 20,
    },
    wrapper: {
        height: 60,
        marginTop: 10,
    },
    loading: {
        height: 20,
    },
});

module.exports = MainScreen;
