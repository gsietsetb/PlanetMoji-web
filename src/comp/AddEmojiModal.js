import C, {apply} from 'consistencss';
import {observer} from 'mobx-react-lite';
import Modal from 'modal-enhanced-react-native-web';
import React from 'react';
import {View} from 'react-native';
import {profile} from '../App';

/*
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
*/
/*import Modal from 'react-native-modal';*/
/*import Icon from 'react-native-vector-icons/FontAwesome5';*/
import {CloseButton} from './Box';

export default observer(({Comp, /*category = Categories.all,*/ onSet, modal = profile.modal, title = 'Update '}) => {
  const closeModal = () => modal.closeModal();
  return (
    <Modal isVisible={modal.show} visible={modal.show} onRequestClose={closeModal} onBackdropPress={closeModal}>
      <View style={apply(C.bgWhite, C.radius2, C.flex, C.justifyCenter, C.itemsCenter, C.contentCenter)}>
        <CloseButton onPress={closeModal} />
        {/*<View style={apply(C.row, C.justifyBetween, C.m4, C.bgWhite)}>*/}
        {/*<Text style={apply(fonts.subtitle, C.top_4)}>
          {title} {board.currentIcon.icon}
        </Text>*/}
        {Comp}
        {/*</View>*/}
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
