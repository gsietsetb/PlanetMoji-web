import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {Modal, Text, View} from 'react-native';
/*
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
*/
/*import Modal from 'react-native-modal';*/
/*import Icon from 'react-native-vector-icons/FontAwesome5';*/
import {fonts} from '../gStyles';
import {profile} from '../stores/profileStore';
import {CloseButton} from './Box';

export default observer(({/*category = Categories.all,*/ onSet, modal = profile.modal, title = 'Update '}) => {
  const closeModal = () => modal.closeModal();
  return (
    <Modal isVisible={modal.show} visible={modal.show} onRequestClose={closeModal} onBackdropPress={closeModal}>
      <View style={apply(C.bgWhite, C.radius2, C.flex, C.maxhHalf)}>
        <View style={apply(C.row, C.justifyBetween, C.m4, C.bgWhite)}>
          <Text style={apply(fonts.subtitle)}>
            {title} {/*{board.currentIcon.icon}*/}
          </Text>
          <CloseButton />
          {/*<Icon name="times" onPress={closeModal} size={16} color={colors.blueGrey} />*/}
        </View>
        {/*{!isWeb && (
          <EmojiSelector
            theme={colors.blue}
            columns={5}
            showCategories={false}
            category={category}
            showTabs={false}
            showSearchBar={false}
            onEmojiSelected={(emoji) => {
              onSet(emoji);
              modal.closeModal();
            }}
          />
        )}*/}
      </View>
    </Modal>
  );
});
