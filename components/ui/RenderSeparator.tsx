import { View } from "react-native"

const renderSeparator = () => <View style={{
    height: 1,              // 高度1像素
    opacity: 0.1,           // 低透明度
    backgroundColor: '#000', // 黑色背景
    marginVertical: 8,      // 垂直外边距
}}></View>

export default renderSeparator