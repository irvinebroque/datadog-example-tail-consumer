import { client, v2 } from '@datadog/datadog-api-client';

let datadogLogs: v2.LogsApi;

export default {
	async tail(events: TraceItem[], env: Env) {
		if (!datadogLogs) {
			const configuration = client.createConfiguration({
				debug: true,
				authMethods: {
					apiKeyAuth: env.DATADOG_API_KEY,
					appKeyAuth: env.DATADOG_APP_KEY,
				},
			});
			configuration.setServerVariables({
				site: "us3.datadoghq.com"
			});
			datadogLogs = new v2.LogsApi(configuration);
		}

		const params: v2.LogsApiSubmitLogRequest = {
			body: [
				{
					ddsource: 'cloudflare-worker',
					ddtags: 'some-tag',
					hostname: 'some-hostname',
					message: '2019-11-19T14:37:58,995 INFO [process.name][20081] Hello World',
					service: 'my-service',
				},
			],
			contentEncoding: 'gzip',
		};

		await datadogLogs
			.submitLog(params)
			.then((data: any) => {
				console.log('API called successfully. Returned data: ' + JSON.stringify(data));
			})
			.catch((error: any) => console.error(error));
	},
} satisfies ExportedHandler<Env>;
