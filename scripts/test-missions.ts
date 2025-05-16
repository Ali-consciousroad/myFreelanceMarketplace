import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

async function testMissions() {
  try {
    // Test GET all missions
    console.log('Testing GET all missions...');
    const getResponse = await fetch(`${API_URL}/missions`);
    const missions = await getResponse.json();
    console.log('GET Response:', missions);

    if (missions.length > 0) {
      const missionId = missions[0].id;

      // Test GET single mission
      console.log('\nTesting GET single mission...');
      const getSingleResponse = await fetch(`${API_URL}/missions/${missionId}`);
      const mission = await getSingleResponse.json();
      console.log('GET Single Response:', mission);

      // Test PUT mission
      console.log('\nTesting PUT mission...');
      const putResponse = await fetch(`${API_URL}/missions/${missionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'IN_PROGRESS',
          dailyRate: 500,
          timeframe: '2 weeks',
          description: 'Updated mission description',
          categoryIds: mission.categories.map((c: any) => c.id),
        }),
      });
      const updatedMission = await putResponse.json();
      console.log('PUT Response:', updatedMission);

      // Test DELETE mission
      console.log('\nTesting DELETE mission...');
      const deleteResponse = await fetch(`${API_URL}/missions/${missionId}`, {
        method: 'DELETE',
      });
      const deleteResult = await deleteResponse.json();
      console.log('DELETE Response:', deleteResult);
    }

    // Test POST new mission
    console.log('\nTesting POST new mission...');
    const postResponse = await fetch(`${API_URL}/missions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'OPEN',
        dailyRate: 400,
        timeframe: '1 week',
        description: 'New test mission',
        clientId: 'your-client-id', // Replace with actual client ID
        categoryIds: [], // Replace with actual category IDs
      }),
    });
    const newMission = await postResponse.json();
    console.log('POST Response:', newMission);

  } catch (error) {
    console.error('Error testing missions:', error);
  }
}

testMissions(); 