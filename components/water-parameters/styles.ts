import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    margin: 10,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  pondName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertBadgeText: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 12,
  },
  alertCard: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertContent: {
    marginTop: 4,
  },
  value: {
    fontSize: 14,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  alertsContainer: {
    marginTop: 10,
  },
  dateTime: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  parameterItem: {
    width: '48%',
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  parameterItemAlert: {
    backgroundColor: '#FFF3F3',
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  parameterNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  parameterNameAlert: {
    color: '#F44336',
  },
  parameterValue: {
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
  },
  parameterValueAlert: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  warningIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  note: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
  },
  divider: {
    marginVertical: 10,
  },
  parametersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
