import React from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import moment from 'moment';
import styles from './styles';

const VideoRow = ({ video , navigation}) => {
    const { item } = video
    const { navigate } = navigation
    return (
        <View>
            <TouchableHighlight onPress={() => navigate('Video', {video: item})}>
                <View style={styles.row}>
                <Image source={ item.thumbnails.default } style={styles.cellImage} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.channel} numberOfLines={1}>
                            {item.channelTitle} {' '} &bull;{' '} {moment(item.publishedAt).fromNow(true)} &bull;{' '} {item.stats.viewCount} views
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
            <View style={styles.cellBorder} />
        </View>
    );
}

export default VideoRow