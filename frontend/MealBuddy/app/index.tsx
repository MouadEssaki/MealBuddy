import { ApplicationProvider, Layout, Text, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './customTheme';
import { Button, Card } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={customTheme}>
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor: customTheme.fond,marginTop: 50 }}>
          <Text category='h1' style={{ color:  customTheme['vert'] }} >Welcome to MealBuddy!</Text>
          <Button onPress={() => alert('Button Pressed')} style={{ backgroundColor: customTheme["orange"], borderColor: customTheme["orange"] }}>
            Press Me
          </Button>
        </Layout>
      </ApplicationProvider>
    </>
  );
}