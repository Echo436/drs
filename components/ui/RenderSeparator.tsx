import { useThemeColor } from "@/hooks/useThemeColor"
import { View } from "react-native"

const renderSeparator = () => {
    const color = useThemeColor({}, 'listSeparator')
    
    return <View style={{
        height: 1,
        backgroundColor: color,
    }}></View>
}

export default renderSeparator