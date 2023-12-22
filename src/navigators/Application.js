import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { Startup, Home } from '@/screens'
import { useTheme } from '@/theme'
const Stack = createStackNavigator()
function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme()
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Startup" component={Startup} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default ApplicationNavigator
