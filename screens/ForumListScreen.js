import PropTypes from 'prop-types';
import React, {Component} from 'react';
import { Container, Content, List, ListItem, Text, Button, Icon, Spinner } from 'native-base';
import {inject, observer} from 'mobx-react/native';
import {NavigationActions} from 'react-navigation';
import { ActivityIndicator } from 'react-native';

/**
 * 论坛列表页，作为drawer的实际UI
 */
@inject('store') @observer
class SideMenu extends Component {
    navigateToScreen (route, forum){
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            action: NavigationActions.navigate({ routeName: 'List' , params:{forum: forum}}),
        });
        this.props.navigation.dispatch(navigateAction);
    }

    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            forums: []
        }
    }

    componentWillMount() {
        this.setState({ loading: true });

        this.props.store.fetchForums()
            .then((results) => {
                this.setState({ loading: false });
                this.setState({ forums: results});
            });
    }

    _handleEntryPress(forum){
        this.props.store.selectForum(null);
        this.props.store.selectSubForum(null);
        if(forum === 'recommend'){
            this.navigateToScreen('TopicList', forum);
        } else if (forum === 'error') {
            console.log(err);
        } else if (forum === 'lag') {
            while (true) {
                console.log('卡死测试');
            }
        } else if (forum === 'alert') {
            alert('温馨提示', '正文内容');
        }
        else {
            this.props.store.selectForum(forum);
            this.navigateToScreen('ForumDetail', forum);
        }
    }

    render () {
        const { forums } = this.state;

        return (
            <Container>
                <Content style={{marginTop: 40, marginLeft: 20}}>
                    { this.state.loading && <ActivityIndicator style={{margin: 20}}/> }
                    <Text style={{marginLeft: 15, marginBottom: 10}} onPress={this._handleEntryPress.bind(this, 'recommend')}>帖子推荐</Text>
                    <Text style={{marginLeft: 15, marginBottom: 10}} onPress={this._handleEntryPress.bind(this, 'error')}>JS错误</Text>
                    <Text style={{marginLeft: 15, marginBottom: 10}} onPress={this._handleEntryPress.bind(this, 'lag')}>卡死</Text>
                    <Text style={{marginLeft: 15, marginBottom: 10}} onPress={this._handleEntryPress.bind(this, 'alert')}>弹出框</Text>
                    <List noBorder>
                        {
                            forums && forums.map((e, i) => {
                                return (
                                    <ListItem noBorder key={i} onPress={this._handleEntryPress.bind(this, e)}>
                                        <Text>{e.name}</Text>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Content>
            </Container>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;