import React from 'react';
import renderer from 'react-test-renderer';

import { ThresholdIncidentListItem } from '../../interfaces/info';
import { SystemInfoContext } from '../../contexts/systemInfo';

import ThresholdIncidentList from './ThresholdIncidentList';

describe('[components] ThresholdIncidentList', () => {
  const tresholdIncidentList: ThresholdIncidentListItem[] = [{
    lastValue: 5,
    date: new Date('2000-01-10 00:00:00'),
    isExceedingLimit: true
  }, {
    lastValue: 5,
    date: new Date('2000-01-10 00:00:00'),
    isExceedingLimit: true
  }, {
    lastValue: 5,
    date: new Date('2000-01-10 00:00:00'),
    isExceedingLimit: true
  }, {
    lastValue: 5,
    date: new Date('2000-01-10 00:00:00'),
    isExceedingLimit: false
  }];


  it('should render correctly', async () => {
    const component = renderer.create(
      <SystemInfoContext.Provider value={{ tresholdIncidentList }}>
        <ThresholdIncidentList />
      </SystemInfoContext.Provider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
