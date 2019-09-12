import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import ImagePicker from "react-native-image-picker";
import { NavigationScreenProp } from "react-navigation";

import Snackbar from "~/actions/Snackbar";
import PhotoAlbumList from "~/components/PhotoAlbumList";
import { ITheme } from "~/modules/types";
import styles from "./Main/styles";

interface IProps {
  navigation: NavigationScreenProp<any, any>;
  screenProps: {
    theme: ITheme;
  };
}

export default class Main extends React.Component<IProps, {}> {
  public render() {
    const { theme } = this.props.screenProps;
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            onPress={this.getPhotoFromCameraRoll}
            style={styles.button}
          >
            <Icon name="photo" iconStyle={styles.icon} type="font-awesome" />
          </TouchableOpacity>
        </View>

        <View style={styles.photoListContainer}>
          <PhotoAlbumList onPhotoPress={this.selectPhotoToDecode} />
        </View>
      </View>
    );
  }

  private getPhotoFromCameraRoll = async () => {
    try {
      ImagePicker.launchImageLibrary(
        {
          mediaType: "photo"
        },
        response => {
          if (!response.didCancel) {
            this.selectPhotoToDecode(response.uri);
          }
        }
      );
    } catch {
      Snackbar.show({
        text: "This app does not have permission to access the camera roll."
      });
    }
  };

  private selectPhotoToDecode = (uri: string) => {
    this.props.navigation.navigate("DecodingProgress", { uri });
  };
}