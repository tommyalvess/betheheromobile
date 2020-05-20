import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, Flatlist, Image, Text, TouchableOpacity } from 'react-native';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';
import estilo from './styles';
import { FlatList } from 'react-native-gesture-handler';

export default function Incidents() {
    //useState - inicializar ele com o mesma tipo da inf que será preenchida depois.
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const navigation = useNavigation();
    const [page, setPage] = useState(1);//informando o nr da pagina;
    const [loading, setLoading] = useState(false);


    function navigateToDetail(incidents) {
        navigation.navigate('Detail', { incidents });
    }

    async function loadIncidents() {
        //Se uma requisição foi feita a outra não será feito. 
        //Evitando que seja feita varias requisições se o usuario ficar puxando para cima 
        //a pagina e solicitando o loading da pagina.
        //Ou seja, se tiver carregando não tente fazer de novo
        if(loading){
            return;
        }
        //Evitando a busca de itens que não existe. 
        //Se ja foi carregado tudo não precisa buscar mais
        if (total > 0 && incidents.length == total){
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });
        setIncidents([... incidents, ... response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }

    //Carregar infs assim q o componete é exibido em tela.
    useEffect(() => {
        loadIncidents();
    }, []);

    return(
        <View style={estilo.container}>
            {/* Cirando o header */}
            <View style={estilo.header} >
                <Image source={logoImg}/>
                <Text style={estilo.headerText}>
                    Total de <Text style={estilo.headerTextBold}>{total} casos</Text>.
                </Text>
            </View>

            {/* Criando o corpo do app */}
            <Text style={estilo.title}>Bem-Vindo</Text>
            <Text style={estilo.description}>Escola um dos casos abaixo e salve o dia.</Text>

            {/* estamos passando o parametro item para variavel incidents - item: incidents */}
            <FlatList 
            data={incidents}
            style={estilo.incidentsList}
            keyExtractor={ incident => String(incident.id)}
            showsVerticalScrollIndicator={false}
            onEndReached={loadIncidents}//quando chegar no final da list carregar mais
            onEndReachedThreshold={0.2}
            renderItem={({ item: incident }) => (
                <View style={estilo.incidents}>
                    <Text style={estilo.incidentProperty}>ONG:</Text>
                    <Text style={estilo.incidentValue}>{incident.name}</Text>

                    <Text style={estilo.incidentProperty}>Caso:</Text>
                    <Text style={estilo.incidentValue}>{incident.title}</Text>

                    <Text style={estilo.incidentProperty}>Valor:</Text>
                    <Text style={estilo.incidentValue}>
                        {Intl.NumberFormat('pt-BR', 
                        { styles: 'currency', currency:'BRL'})
                        .format(incident.value)}</Text>
                
                    <TouchableOpacity
                        style={estilo.detailsButton}
                        onPress={() => navigateToDetail(incident)}>
                        <Text style={estilo.detailsButtonText}>Ver mais detalhes</Text>
                        <Feather name="arrow-right" size={16} color="#E02041" />
                    </TouchableOpacity>
                </View>
            )}
            />     

        </View>
    );
}