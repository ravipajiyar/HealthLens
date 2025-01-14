import { Image, ListItem, Skeleton, Text } from '@rneui/themed';
import { useState } from 'react';
import { View } from 'react-native';
import styles from '../styles';

const NutrientList = ({ loading, imageUri, label, nutrients, ingredients }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <View style={styles.imageContainer}>
        {loading ? (
          <Skeleton width={160} height={120} />
        ) : (
          <Image source={{ uri: imageUri }} containerStyle={styles.image} />
        )}
      </View>
      <View style={styles.header}>
        {loading ? (
          <Skeleton width={240} height={40} />
        ) : (
          <Text style={styles.heading}>{label}</Text>
        )}
      </View>
      {loading
        ? Array(6)
            .fill(0)
            .map((_, i) => (
              <ListItem key={i}>
                <ListItem.Content>
                  <Skeleton width={120} height={40} />
                </ListItem.Content>
                <ListItem.Content right>
                  <Skeleton width={120} height={40} />
                </ListItem.Content>
              </ListItem>
            ))
        : nutrients.map((n, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{n.nutrientName}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Content right>
                <ListItem.Title>
                  {Math.round(n.unit) + ' ' + n.unitType}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
      {loading ? (
        <ListItem>
          <Skeleton width={340} height={40} />
        </ListItem>
      ) : (
        <ListItem.Accordion
          content={
            <ListItem.Content>
              <ListItem.Title>Ingredients</ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded}
          onPress={() => {
            setExpanded(!expanded);
          }}
        >
          <ListItem>
            <ListItem.Content>
              <ListItem.Subtitle>{ingredients}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </ListItem.Accordion>
      )}
    </View>
  );
};

export default NutrientList;
