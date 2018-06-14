/**
 * @flow
 * 最外层的view,控制整体的头部标题和不同loading的显示与隐藏
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    ImageBackground,
    DeviceEventEmitter,
    
} from 'react-native';
import {observer,inject} from 'mobx-react';
import BaseNavBar from './BaseNavBar'
import {BaseError,BaseImage} from './index';
import {Loading} from "./BaseLoading";
import {Toast} from "../utils/Toast";
import store from "../mobx";
import {Search} from '../page/search/Search';


type Props={
    store: any,
    onErrorPress: ()=>mixed,
    onLoading:()=>mixed,
}

@inject('baseTheme')
@observer
export default class BaseContainer extends Component <Props>{

      constructor(props) {
        super(props);
        this.baseTheme = this.props.baseTheme;
        this.isDark = this.props.baseTheme.isDark;
        this.changeImage = this.props.baseTheme.changeImage;

      }

    /**
     * 重新加载
      */
    defaultPress = () => {
        const {store} = this.props;
        store.fetchAgain()
    };

    /**
     *  @store 接受不同store,控制loading和error的显示和隐藏
     *  @children 需要包裹的组件
     *  @loading_children  控制不同的loading的显示
      * @returns {*}
     */
    renderContent() {
        const {store, children, onErrorPress,loading_children} = this.props;
        if (!store) return children;
        const {isLoading, isError} = store;

        if (isLoading) {
            if(loading_children) return loading_children;
            return <Loading/>
        }
        if (isError) return <BaseError onPress={onErrorPress || this.defaultPress}/>;
        return children;
    }

    /**
     * 全局头部组件的控制
     * @returns {*}
     */
    renderNavView() {
        const {navBar, store,...navProps} = this.props;
        let navView = null;
        if (typeof navBar === 'undefined') {
            navView = <BaseNavBar {...navProps}/>
        } else {
            navView = navBar;
        }

        return navView
    }

    /**
     * 全局Toast控制
     * @returns {*}
     */
    renderToast(){

        const {store} = this.props;
        if (store) {
            const {isToast,toastMsg} = store;
            if (isToast){
                //DeviceEventEmitter.emit('show','显示');
                return <Toast toastMsg={toastMsg}/>
            }
        }
        return null
    }

    renderSearch(){
        const {store} = this.props;
        if (store){
            const {isSearch} = store;
            console.log('搜索',isSearch)
            if(isSearch){
                return <Search/>
            }else {
                return null

            }
        }
        return null
    }

    render() {

        const {style} = this.props;
        this.changeImage = BaseImage.reader_background_brown_big_img6;
        const color = this.changeImage?'transparent':this.baseTheme.brightBackGroundColor;
        return(
            this.renderItem(this.baseTheme.brightBackGroundColor)
        )
        // if (this.changeImage) {
        //     this.isDark = true
        // }
        //

       // if (this.isDark) {
       //         return(
       //             this.renderItem(this.baseTheme.brightBackGroundColor)
       //         )
       //     }else {
       //         if (this.changeImage){
       //             return(
       //                 <ImageBackground
       //                     source={this.changeImage}
       //                     style={{flex:1,width:WIDTH}}>
       //                     {this.renderItem('transparent')}
       //                 </ImageBackground>
       //             )
       //         } else {
       //             return(
       //                 <ImageBackground
       //                     style={{flex:1,width:WIDTH}}>
       //                     {this.renderItem(this.baseTheme.brightBackGroundColor)}
       //                 </ImageBackground>
       //             )
       //         }
       //     }

        // return(
        //
        //     this.isDark ? this.renderItem(color):
        //     <ImageBackground
        //         source={this.changeImage}
        //         style={{flex:1,width:WIDTH}}>
        //         {this.renderItem(color)}
        //     </ImageBackground>
        //
        // )
    }

    renderItem=(color)=>{

        return( <View style={[styles.container,{backgroundColor:color}]}>
                {this.renderToast()}
                {this.renderSearch()}
                {this.renderNavView()}
                {this.renderContent()}
                <StatusBar
                    backgroundColor='#FFFFFF'
                    barStyle='dark-content'/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});