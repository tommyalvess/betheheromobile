import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Linking, Image, Text, TouchableOpacity } from 'react-native';
// Pegando todas exportações com  * jogando na variavel Mail
import * as MailComposer from 'expo-mail-composer';


import estilo from './styles';
import logoImg from '../../assets/logo.png';

export default function Detail() {

    const navigation = useNavigation();
    const route = useRoute();
    //incidents e o valor que foi passado como parametro anterior
    const incidents = route.params.incidents;
    const msg = `Ola ${incidents.title}, eu gostaria de doar o valor de ${incidents.value}`;

    

    function navigateBack() {
        navigation.goBack();
    }

    function sendEmail() {
        MailComposer.composeAsync({
            subject: `Herói do caso: ${incidents.title}`,
            recipients: [incidents.email],
            body: msg,
        })
    }
    //Substituir o numero fisico pelo numero recebido da api
    function sendWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=5511979589357 t={msg}`)
    }

    return(
        <View style={estilo.container}>
            <View style={estilo.header}>
                <Image source={logoImg} />
                <TouchableOpacity onPress={navigateBack}>
                    <Feather name="arrow-left" size={26} color="#E82041" />
                </TouchableOpacity>
            </View>

            <View style={estilo.incidents}>
                <Text style={[estilo.incidentProperty, {marginTop: 0}]}>ONG:</Text>
    <Text style={estilo.incidentValue}>{incidents.name} de {incidents.city}/{incidents.uf}</Text>

                <Text style={estilo.incidentProperty}>Caso:</Text>
                    <Text style={estilo.incidentValue}>{incidents.title}</Text>

                <Text style={estilo.incidentProperty}>Valor:</Text>
                <Text style={estilo.incidentValue}>{incidents.value}</Text>
            
            </View>

            <View style={estilo.contactBox}>
                <Text style={estilo.heroTitle}>Salve o dia!</Text>
                <Text style={estilo.heroTitle}>Seja o herói desse caso.</Text>
            
                <Text style={estilo.heroiDescription}>Entre em contato:</Text>

                <View style={estilo.actions}>
                    <TouchableOpacity style={estilo.action} onPress={sendWhatsapp}>
                        <Text style={estilo.actionText}>WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={estilo.action} onPress={sendEmail}>
                        <Text style={estilo.actionText}>E-mail</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}