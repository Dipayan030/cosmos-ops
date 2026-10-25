import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'

export default function index() {
  return (
    <SafeAreaView className="bg-black flex-1 flex-col">
        <StatusBar barStyle="light-content" backgroundColor="#0B0C10" />
        <Header pageTitle='Dashboard'></Header>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})