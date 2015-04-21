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

var fetch = require('fetch');

var BASE_URL = 'http://getnewsblock.com/api/';

var resultsCache = {
    dataForQuery: {},
    totalForQuery: {},
    timeForQuery:{}
};

var MainScreen = React.createClass({
    mixins: [TimerMixin],
    timeoutID: (null: any),

getInitialState: function() {
    return {
        isLoading: true,
        dataSource: new ListView.DataSource({
            rowHasChanged:() => (row1, row2) => row1 !== row2,
        }),
        filter: 'nation',
    };
},

componentDidMount: function() {
    var _filter = this.props.filter || this.state.filter;
    this.fetchVideos(_filter);
},

fetchVideos: function(query: string) {
    
    this.timeoutID = null;
    this.setState({
                isLoading: true,
                filter:query
            });

    var expiry = 1 * 60 * 1000; // cache expiration
    if(resultsCache.timeForQuery[query] + expiry > new Date().getTime()) {
        this.setState({
            isLoading: false,
            dataSource: this.getDataSource(resultsCache.dataForQuery[query])
        });
        return;
    }

    fetch(BASE_URL+query)
        .then((response) => response.json())
        .catch((error) => {
            console.log('## error');
            var availableData =  resultsCache.dataForQuery[query] || [];

            this.setState({
                dataSource: this.getDataSource(availableData),
                isLoading: false,
            });
        })
        .then((responseData) => {

            if(!responseData || !responseData.videos){ // abort when no videos
              //  this.setState({isLoading: false});
                return;
            }
            console.log('## fetched', responseData.videos.length, query);

            resultsCache.totalForQuery[query] = responseData.videos.length;
            resultsCache.dataForQuery[query] = responseData.videos;
            resultsCache.timeForQuery[query] = new Date().getTime();

            this.setState({
                isLoading: false,
                dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
            });
        })
        .done();
},

getDataSource: function(videos: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(videos);
},

selectVideo: function(video: Object) {
    this.props.navigator.push({
        title: video.title,
        component: VideoWebView,
        passProps: {
            video: video,
            url:'https://www.youtube.com/embed/'+ video.videoId +"?autoplay=1" //'http://www.w3portals.com/videotest.html'//
        }
    });
},

renderRow: function(video: Object)  {
    return (
        <VideoRow
            onSelect={() => this.selectVideo(video)}
            video={video}
        />
    );
},

handleScroll: function(event: Object) {

    if (event.nativeEvent.contentOffset.y < -110) { // pull-down
        this.setState({isLoading: true});
        var filter = this.props.filter || this.state.filter;
        // reduce dup fetches
        this.clearTimeout(this.timeoutID);
        this.timeoutID = this.setTimeout(() => this.fetchVideos(filter), 50);
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
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="onDrag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            onScroll={this.handleScroll}
        />;

    if (this.state.isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicatorIOS
                    animating={this.state.isLoading}
                    style={[{marginTop: 75}]}
                />
               {results}
            </View>
        );
    }
    else {
        return (
            <View style={styles.container}>
                <View style={[styles.separator, {marginTop: 64}]} />
                {results}
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
