'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Text,
    ListView,
    PixelRatio,
    TouchableHighlight,
    View
    } = React;

var MainScreen = require('./MainScreen');

var TOPICS = [
    {name:'Sports'},{name:'Entertainment'}, {name:'Music'},{name:'Science'},
    {name:'Technology'}, {name:'Business'},{name:'World'},{name:'Politics'}];

var TopicsListView = React.createClass({

    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(TOPICS),
        };
    },

    render: function () {
      return (
          <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
          />
      );
    },

    renderRow: function(topic: Object)  {
        return (
            <NavButton
                onPress={() => this.selectTopic(topic)}
                text={topic.name}
                />
        );
    },

    selectTopic: function(topic: Object) {
        this.setState({filter:topic.name.toLowerCase()});

        this.props.navigator.push({
            title: topic.name,
            component: MainScreen,
            passProps: {
                filter: topic.name.toLowerCase(),
            }
        });
    },

});

var NavButton = React.createClass({

    render: function() {
        return (
            <TouchableHighlight
                style={styles.button}
                activeOpacity={1}
                animationVelocity={0}
                underlayColor="rgb(210, 230, 255)"
                onPress={this.props.onPress}>
                <Text style={styles.buttonText}>
                    {this.props.text}
                </Text>
            </TouchableHighlight>
        )
    }
});

var styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    button: {
        backgroundColor: 'white',
        padding: 9,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#CDCDCD',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '500',
        marginTop: 5,
        padding: 7,
        marginLeft: 55,
    },
});

module.exports = TopicsListView;