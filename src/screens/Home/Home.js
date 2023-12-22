import { View, Text, Pressable, Platform, StyleSheet } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Share from 'react-native-share'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import RNFetchBlob from 'react-native-blob-util'
import RNFS from 'react-native-fs'
const Home = () => {
  const viewRef = useRef()
  const [isInstagramAvailable, setIsInstagramAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  //Check if Instagram is installed on the device
  useEffect(() => {
    Share.isPackageInstalled('com.instagram.android')
      .then(({ isInstalled }) => setIsInstagramAvailable(isInstalled))
      .then(console.log('Instagram = ', isInstagramAvailable))
  }, [])

  const handleShareGeneric = async () => {
    try {
      setIsLoading(true)
      const imageUrl =
        'https://assets.openhouse.study/logos/logo.full.orange.png'

      // Fetch the image as a base64-encoded string
      const response = await RNFetchBlob.config({ fileCache: true }).fetch(
        'GET',
        imageUrl
      )
      const base64Image = await response.base64()

      // Save the base64 image to a local file
      const imagePath = `${RNFetchBlob.fs.dirs.CacheDir}/sharedImage.png`
      await RNFetchBlob.fs.writeFile(imagePath, base64Image, 'base64')

      // Share the local file
      Share.open({ url: `file://${imagePath}` })
        .then(() => console.log('Image shared successfully'))
        .catch((error) => console.error('Error sharing image:', error))
    } catch (err) {
      console.error('Error handling share:', err)
    }
    setIsLoading(false)
    // captureScreen({ format: 'jpg', quality: 0.8 })
    //   .then((uri) => {
    //     console.log(uri)
    //     return uri
    //   })
    //   .then((uri) => {
    //     Share.open({ url: uri })
    //   })
    //   .catch((error) => console.error('Oops, snapshot failed', error))
  }

  const handleShareInstagram = async () => {
    setIsLoading(true)
    const imageUrl = 'https://assets.openhouse.study/logos/logo.full.orange.png'

    // Fetch the image as a base64-encoded string
    const response = await RNFetchBlob.config({ fileCache: true }).fetch(
      'GET',
      imageUrl
    )
    const base64Image = await response.base64()

    // Save the base64 image to a local file
    const imagePath = `${RNFetchBlob.fs.dirs.CacheDir}/sharedImage.png`
    await RNFetchBlob.fs.writeFile(imagePath, base64Image, 'base64')

    Share.shareSingle({
      url: `file://${imagePath}`,
      social: Share.Social.INSTAGRAM,
      type: 'image/*'
    })
      .then((res) => console.log('shared', res))
      .catch((err) => console.log(err))
      .then(() => setIsLoading(false))
  }

  const handleShareInstagramVideo = async () => {
    try {
      setIsLoading(true)
      const videoUrl =
        'https://res.cloudinary.com/openhouse-study/video/upload/w_500,h_500,q_100,g_center,f_auto,c_fit/v1669813712/oh_moments/production/o5mktbua7ctgxvcdcf43.mov' // Replace with your video URL
      const videoExt = videoUrl.split('.').pop()
      console.log('videoExt', videoExt)
      // Fetch the video
      console.log('Started downloading video...')
      const result = await RNFetchBlob.config({
        fileCache: true,
        appendExt: videoExt
      }).fetch('GET', videoUrl, {})
      console.log('Finished downloading video', result.path())
      console.log('Started Saving Video')

      const gallery = await CameraRoll.save(result.path(), 'video')
      result.flush()
      console.log('Finished Saving Video', result)

      //   Share the local video file
      Share.shareSingle({
        url: gallery,
        social: Share.Social.INSTAGRAM,
        type: 'video/*'
      })
        .then(() => {
          console.log('Video share initiated')
          // Delete the file after sharing
          RNFS.unlink(result.path())
            .then(() => console.log('File deleted successfully'))
            .catch((err) => console.error('Error deleting file:', err))
        })
        .catch((error) => console.error('Error sharing video:', error))
    } catch (err) {
      console.error('Error handling share:', err)
    }
    setIsLoading(false)
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.margin}>
        <Text style={styles.headingText}>Home</Text>
        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={handleShareGeneric}
            disabled={isLoading}
            style={[styles.button, isLoading ? { opacity: 0.5 } : {}]}>
            <Text style={styles.buttonText}>Share generic</Text>
          </Pressable>

          <Pressable
            onPress={handleShareInstagram}
            disabled={!isInstagramAvailable || isLoading}
            style={[
              styles.button,
              !isInstagramAvailable || isLoading ? { opacity: 0.5 } : {}
            ]}>
            <Text style={styles.buttonText}>Share INSTAGRAM</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={handleShareInstagramVideo}
          disabled={!isInstagramAvailable || isLoading}
          style={[
            styles.button,
            !isInstagramAvailable || isLoading ? { opacity: 0.5 } : {}
          ]}>
          <Text style={styles.buttonText}>Share INSTAGRAM (video)</Text>
        </Pressable>
        {/* <View style={styles.shareImageContainer} ref={viewRef}>
        <View style={styles.shareImage}>
          <Text style={styles.shareImageText}>SHARED?</Text>
        </View>
      </View> */}
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#111111'
  },
  margin: {
    marginHorizontal: 20
  },
  headingText: {
    color: 'white',
    fontSize: 32,
    marginVertical: 20,
    textAlign: 'center'
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: 'white',
    padding: 4,
    paddingHorizontal: 20,
    borderRadius: 100
  },
  buttonText: { fontSize: 16, textAlign: 'center' },
  shareImageContainer: {
    padding: 60,
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginBottom: 20
  },
  shareImage: {
    backgroundColor: 'orange',
    height: 200,
    width: 200,
    borderRadius: 20
  },
  shareImageText: {
    color: 'black',
    textAlign: 'center',
    padding: 24,
    fontSize: 24
  }
})
