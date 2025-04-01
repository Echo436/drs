import { useThemeColor } from "@/hooks/useThemeColor"
import { View } from "react-native"

const renderSeparator = () => {
    const color = useThemeColor({}, 'listSeparator')
    
    return <View style={{
        height: 1,
        backgroundColor: color,
        marginVertical: 8,
    }}></View>
}

export default renderSeparator