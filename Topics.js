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

var TopicsView = React.createClass({

    render: function() {
        return (
            <View style={styles.scene}>
                <NavButton
                    onPress={() => this.selectTopic({name:'Sports'})}
                    text="Sports"
                />
                <NavButton
                    onPress={() => this.selectTopic({name:'Entertainment'})}
                    text="Entertainment"
                />
                <NavButton
                    onPress={() => this.selectTopic({name:'Science'})}
                    text="Science"
                />
                <NavButton
                    onPress={() => this.selectTopic({name:'Technology'})}
                    text="Technology"
                />
                <NavButton
                    onPress={() => this.selectTopic({name:'Business'})}
                    text="Business"
                />
                <NavButton
                    onPress={() => this.selectTopic({name:'World'})}
                    text="World"
                />
            </View>

        );
    },

    selectTopic: function(topic: Object) {
        console.log('### selectTopic1', topic);
        this.setState({filter:topic.name});

        this.props.navigator.push({
            title: topic.name,
            component: MainScreen,
            passProps: {
                filter: topic.name.toLowerCase(),
            }
        });
    },

});

var styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
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
    scene: {
        //flex: 1,
        paddingTop: 0,
        marginTop:64,
        backgroundColor: '#EAEAEA',
    }
});

module.exports = TopicsView;