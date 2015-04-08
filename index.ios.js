'use strict';

var React = require('react-native');
var {
    AppRegistry,
    NavigatorIOS,
    StyleSheet,
    } = React;

var MainScreen = require('./MainScreen');
var TopicsView = require('./Topics');

var newswatchApp = React.createClass({
    render: function() {
        return (
            <NavigatorIOS
                ref="nav"
                style={styles.container}
                initialRoute={{
                    title: 'Top Videos',
                    component: MainScreen,
                    rightButtonTitle: 'Topics',
                    onRightButtonPress: () => {
                        this.refs.nav.navigator.push({
                            title: "Topics",
                            component: TopicsView,
                            rightButtonTitle: 'Cancel',
                            onRightButtonPress: () => {this.refs.nav.navigator.pop();}
                        });}
                }}
            />
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

AppRegistry.registerComponent('newswatch', () => newswatchApp);

module.exports = newswatchApp;
