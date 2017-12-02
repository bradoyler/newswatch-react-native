import React, { Component } from "react";
import PropTypes from 'prop-types';
import { FlatList, View, ActivityIndicatorIOS } from 'react-native';
// import { StackNavigator } from 'react-navigation';
// import TimerMixin from 'react-timer-mixin'

import log from '../lib/logger'
import styles from '../components/styles'
import VideoRow from '../components/VideoRow';
// import VideoWebView from '../components/VideoWebView';
// import NoVideo from './components/NoVideo';

const BASE_URL = 'http://api.newsblock.io/api/';

const resultsCache = {
    dataForQuery: {},
    totalForQuery: {},
    timeForQuery:{}
};

class HomeScreen extends Component {
  
  static navigationOptions = { title: 'Home' }
  
  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        data: [],
        filter: 'nation',
        error: null,
    };
  }

  componentDidMount() {
    // log(this.props.navigation, 'componentDidMount() navigation....');
    const _filter = this.props.filter || this.state.filter;
    this.fetchVideos(_filter);
  }

 fetchVideos(query: string) {
    
    this.timeoutID = null;
    this.setState({
                isLoading: true,
                filter:query
            });

    const expiry = 1 * 60 * 1000; // cache expiration
    if(resultsCache.timeForQuery[query] + expiry > new Date().getTime()) {
        this.setState({
            isLoading: false,
            data: resultsCache.dataForQuery[query]
        });
        return;
    }

    fetch(BASE_URL+query)
        .then((response) => response.json())
        .then((responseData) => {
          log('>>> fetched', BASE_URL+query);

            if(!responseData || !responseData.videos){ // abort when no videos
                log('### no responseData');
                return;
            }
            log('## fetched', responseData.videos.length, query);

            resultsCache.totalForQuery[query] = responseData.videos.length;
            resultsCache.dataForQuery[query] = responseData.videos;
            resultsCache.timeForQuery[query] = new Date().getTime();
            
  // console.log(resultsCache.dataForQuery[query].length,'dataForQuery', query);
            
            this.setState({
                isLoading: false,
                data: resultsCache.dataForQuery[query]
            });
        })
        .catch(error => {
            log('## error for: '+ query, error);
            const availableData =  resultsCache.dataForQuery[query] || [];

            this.setState({
                data: availableData,
                isLoading: false,
            });
        })
        .done();
}

handleScroll(event: Object) {
  if (event.nativeEvent.contentOffset.y < -110) { // pull-down
      this.setState({isLoading: true});
      const filter = this.props.filter || this.state.filter;
      // reduce dup fetches
      this.clearTimeout(this.timeoutID);
      this.timeoutID = this.setTimeout(() => this.fetchVideos(filter), 250);
  }
}

renderItem(video: Object) {
  return (<VideoRow video={video} navigation={this.props.navigation} />)
}

onRenderItem (video: Object) {
  this.renderItem(video: Object);
}

render() {
  const keyExtractor = (item) => item._id;

  return (
    <FlatList
      data={this.state.data}
      keyExtractor={keyExtractor}
      renderItem={this.renderItem.bind(this)}
    />
  );
}

renderHeader () {
    if (this.state.isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicatorIOS
                    animating={this.state.isLoading}
                    style={styles.marginTop}
                />
            </View>
        );
    }
 }
}

HomeScreen.defaultProps = {
  filter: 'cover',
  isLoading: true
};

HomeScreen.propTypes = {
  filter: PropTypes.string,
  navigation: PropTypes.object,
//   isLoading: PropTypes.boolean
};

export default HomeScreen
