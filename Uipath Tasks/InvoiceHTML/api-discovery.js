// UiPath Maestro API Discovery Script
// Run this in your browser console to discover available API parameters

console.log('=== UiPath Maestro API Discovery ===\n');

// 1. Inspect the SDK structure
console.log('1. SDK Structure:');
console.log('Available methods:', Object.keys(window.sdk.maestro.processes.instances));
console.log('\n');

// 2. Try a basic call and observe the network request
console.log('2. Making a basic API call...');
console.log('Open Network tab to see the actual HTTP request!\n');

const testCall = async () => {
    try {
        // Basic call
        const result = await window.sdk.maestro.processes.instances.getAll({
            processKey: 'd0d245fb-a685-4784-9320-5de1601d3463'
        });

        console.log('✓ Basic call successful');
        console.log('Number of results:', result?.length || result?.value?.length || 'unknown');
        console.log('Sample result structure:', result[0] || result?.value?.[0]);
        console.log('\n');

        // 3. Try with common OData parameters
        console.log('3. Testing common OData parameters...\n');

        // Test $top
        console.log('Testing $top parameter...');
        const topResult = await window.sdk.maestro.processes.instances.getAll({
            processKey: 'd0d245fb-a685-4784-9320-5de1601d3463',
            $top: 5
        });
        console.log('✓ $top works:', topResult?.length || topResult?.value?.length, 'results');

        // Test $orderby
        console.log('Testing $orderby parameter...');
        const sortResult = await window.sdk.maestro.processes.instances.getAll({
            processKey: 'd0d245fb-a685-4784-9320-5de1601d3463',
            $orderby: 'startedTime desc',
            $top: 3
        });
        console.log('✓ $orderby works');
        console.log('First result startedTime:', sortResult[0]?.startedTime || sortResult?.value?.[0]?.startedTime);

        // Test $filter
        console.log('Testing $filter parameter...');
        const filterResult = await window.sdk.maestro.processes.instances.getAll({
            processKey: 'd0d245fb-a685-4784-9320-5de1601d3463',
            $filter: "status eq 'Successful'",
            $top: 3
        });
        console.log('✓ $filter works');
        console.log('Filtered results:', filterResult?.length || filterResult?.value?.length);

        // 4. Show all available fields
        console.log('\n4. Available fields in process instance:');
        const sampleInstance = result[0] || result?.value?.[0];
        if (sampleInstance) {
            Object.keys(sampleInstance).forEach(key => {
                console.log(`  - ${key}: ${typeof sampleInstance[key]}`);
            });
        }

    } catch (error) {
        console.error('Error during discovery:', error);
        console.log('Error message:', error.message);
        console.log('This can help identify what parameters are NOT supported');
    }
};

// Run the discovery
testCall();

console.log('\n=== Discovery Complete ===');
console.log('Check the Network tab in DevTools to see actual HTTP requests!');
console.log('Look for calls to /api/maestro or similar endpoints');
