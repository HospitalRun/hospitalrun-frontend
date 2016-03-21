/**
 * This file includes all of the configuration variables used by the Node.js
 * module. If there's a configurable element of the module and it's not
 * described in here, there's been a terrible mistake.
 */
exports.config = {
  /**
   * Array of application names.
   *
   * @env NEW_RELIC_APP_NAME
   */
  app_name: ['HospitalRun Joel Worrall dev'],
  /**
   * The user's license key. Must be set by per-app configuration file.
   *
   * @env NEW_RELIC_LICENSE_KEY
   */
  license_key: '840ce085b68aa062d333c4d7e8529d6f5ae4a9fe',
  /**
   * Hostname for the New Relic collector proxy.
   *
   * You shouldn't need to change this.
   *
   * @env NEW_RELIC_HOST
   */
  host: 'collector.newrelic.com',
  /**
   * The port on which the collector proxy will be listening.
   *
   * You shouldn't need to change this.
   *
   * @env NEW_RELIC_PORT
   */
  port: 443,
  /**
   * Whether or not to use SSL to connect to New Relic's servers.
   *
   * @env NEW_RELIC_USE_SSL
   */
  ssl: true,
  /**
   * Proxy url
   *
   * A proxy url can be used in place of setting
   * proxy_host, proxy_port, proxy_user, and proxy_pass.
   *
   * e.g. http://user:pass@host:port/
   *
   * Setting proxy will override other proxy settings.
   *
   * @env NEW_RELIC_PROXY_URL
   */
  proxy: '',
  /**
   * Proxy host to use to connect to the internet.
   *
   * @env NEW_RELIC_PROXY_HOST
   */
  proxy_host: '',
  /**
   * Proxy port to use to connect to the internet.
   *
   * @env NEW_RELIC_PROXY_PORT
   */
  proxy_port: '',
  /**
   * Proxy user name when required.
   *
   * @env NEW_RELIC_PROXY_USER
   */
  proxy_user: '',
  /**
   * Proxy password when required.
   *
   * @env NEW_RELIC_PROXY_PASS
   */
  proxy_pass: '',
  /**
   * Custom SSL certificates
   *
   * If your proxy uses a custom SSL certificate, you can add the CA text to
   * this array, one entry per certificate.
   *
   * The easiest way to do this is with `fs.readFileSync` e.g.
   *
   * certificates: [
   *   require('fs').readFileSync('custom.crt', 'utf8') // don't forget the utf8
   * ]
   *
   */
  certificates: [],
  /**
   * You may want more control over how the module is configured and want to
   * disallow the use of New Relic's server-side configuration. To do so, set
   * this parameter to true. Some configuration information is required to make
   * the module work properly with the rest of New Relic, but settings such as
   * apdex_t and capture_params will not be override-able by New Relic with this
   * setting in effect.
   *
   * @env NEW_RELIC_IGNORE_SERVER_CONFIGURATION
   */
  ignore_server_configuration: false,
  /**
   * Whether the module is enabled.
   *
   * @env NEW_RELIC_ENABLED
   */
  agent_enabled: true,
  /**
   * The default Apdex tolerating / threshold value for applications, in
   * seconds. The default for Node is apdexT to 100 milliseconds, which is
   * lower than New Relic standard, but Node.js applications tend to be more
   * latency-sensitive than most.
   *
   * @env NEW_RELIC_APDEX
   */
  apdex_t: 0.100,
  /**
   * Whether to capture parameters in the request URL in slow transaction
   * traces and error traces. Because this can pass sensitive data, it's
   * disabled by default. If there are specific parameters you want ignored,
   * use ignored_params.
   *
   * @env NEW_RELIC_CAPTURE_PARAMS
   */
  capture_params: false,
  /**
   * Array of parameters you don't want captured off request URLs in slow
   * transaction traces and error traces.
   *
   * @env NEW_RELIC_IGNORED_PARAMS
   */
  ignored_params: [],
  logging: {
    /**
     * Verbosity of the module's logging. This module uses bunyan
     * (https://github.com/trentm/node-bunyan) for its logging, and as such the
     * valid logging levels are 'fatal', 'error', 'warn', 'info', 'debug' and
     * 'trace'. Logging at levels 'info' and higher is very terse. For support
     * requests, attaching logs captured at 'trace' level are extremely helpful
     * in chasing down bugs.
     *
     * @env NEW_RELIC_LOG_LEVEL
     */
    level: 'trace',
    /**
     * Where to put the log file -- by default just uses process.cwd +
     * 'newrelic_agent.log'. A special case is a filepath of 'stdout',
     * in which case all logging will go to stdout, or 'stderr', in which
     * case all logging will go to stderr.
     *
     * @env NEW_RELIC_LOG
     */
    filepath: require('path').join(process.cwd(), 'newrelic_agent.log'),
    /**
     * Whether to write to a log file at all
     *
     * @env NEW_RELIC_LOG_ENABLED
     */
    enabled: true
  },
  /**
   * Whether to collect & submit error traces to New Relic.
   *
   * @env NEW_RELIC_ERROR_COLLECTOR_ENABLED
   */
  error_collector: {
    /**
     * Disabling the error tracer just means that errors aren't collected
     * and sent to New Relic -- it DOES NOT remove any instrumentation.
     */
    enabled: true,
    /**
     * List of HTTP error status codes the error tracer should disregard.
     * Ignoring a status code means that the transaction is not renamed to
     * match the code, and the request is not treated as an error by the error
     * collector.
     *
     * Defaults to 404 NOT FOUND.
     *
     * @env NEW_RELIC_ERROR_COLLECTOR_IGNORE_ERROR_CODES
     */
    ignore_status_codes: [404],
    /**
     * Whether error events are collected.
     */
    capture_events: true,
    /**
     * The agent will collect all error events up to this number per minute.
     * If there are more than that, a statistical sampling will be collected.
     * Currently this uses a reservoir sampling algorithm.
     *
     * By increasing this setting you are both increasing the memory
     * requirements of the agent as well as increasing the payload to the New
     * Relic servers. The memory concerns are something you should consider for
     * your own server's sake. The payload of events is compressed, but if it
     * grows too large the New Relic servers may reject it.
     */
    max_event_samples_stored: 100
  },
  /**
   * Options regarding collecting system information. Used for system
   * utilization based pricing scheme.
   */
  utilization: {
    /**
     * This flag dictates whether the agent attempts to reach out to AWS
     * to get info about the vm the process is running on.
     *
     * @env NEW_RELIC_UTILIZATION_DETECT_AWS
     */
    detect_aws: true,
    /**
     * This flag dictates whether the agent attempts to reach out to AWS
     * to get info about the container the process is running in.
     *
     * @env NEW_RELIC_UTILIZATION_DETECT_DOCKER
     */
    detect_docker: true
  },
  transaction_tracer: {
    /**
     * Whether to collect & submit slow transaction traces to New Relic. The
     * instrumentation is loaded regardless of this setting, as it's necessary
     * to gather metrics. Disable the agent to prevent the instrumentation from
     * loading.
     *
     * @env NEW_RELIC_TRACER_ENABLED
     */
    enabled: true,
    /**
     * The duration at below which the slow transaction tracer should collect a
     * transaction trace. If set to 'apdex_f', the threshold will be set to
     * 4 * apdex_t, which with a default apdex_t value of 500 milliseconds will
     * be 2 seconds.
     *
     * If a time is provided, it is set in seconds.
     *
     * @env NEW_RELIC_TRACER_THRESHOLD
     */
    transaction_threshold: 'apdex_f',
    /**
     * Increase this parameter to increase the diversity of the slow
     * transaction traces recorded by your application over time. Confused?
     * Read on.
     *
     * Transactions are named based on the request (see the README for the
     * details of how requests are mapped to transactions), and top_n refers to
     * the "top n slowest transactions" grouped by these names. The module will
     * only replace a recorded trace with a new trace if the new trace is
     * slower than the previous slowest trace of that name. The default value
     * for this setting is 20, as the transaction trace view page also defaults
     * to showing the 20 slowest transactions.
     *
     * If you want to record the absolute slowest transaction over the last
     * minute, set top_n to 0 or 1. This used to be the default, and has a
     * problem in that it will allow one very slow route to dominate your slow
     * transaction traces.
     *
     * The module will always record at least 5 different slow transactions in
     * the reporting periods after it starts up, and will reset its internal
     * slow trace aggregator if no slow transactions have been recorded for the
     * last 5 harvest cycles, restarting the aggregation process.
     *
     * @env NEW_RELIC_TRACER_TOP_N
     */
    top_n: 20,

    /**
     * This option affects both slow-queries and record_sql for transaction
     * traces.  It can have one of 3 values: 'off', 'obfuscated' or 'raw'
     * When it is 'off' no slow queries will be captured, and backtraces
     * and sql will not be included in transaction traces.  If it is 'raw'
     * or 'obfuscated' and other criteria (slow_sql.enabled etc) are met
     * for a query. The raw or obfuscated sql will be included in the
     * transaction trace and a slow query sample will be collected.
     */
    record_sql: 'off',

    /**
     * This option affects both slow-queries and record_sql for transaction
     * traces.  This is the minimum duration a query must take (in ms) for it
     * to be considered for for slow query and inclusion in transaction traces.
     */
    explain_threshold: 500
  },
  /**
   * Whether to enable internal supportability metrics and diagnostics. You're
   * welcome to turn these on, but they will probably be most useful to the
   * New Relic node engineering team.
   */
  debug: {
    /**
     * Whether to collect and submit internal supportability metrics alongside
     * application performance metrics.
     *
     * @env NEW_RELIC_DEBUG_METRICS
     */
    internal_metrics: true,
    /**
     * Traces the execution of the transaction tracer. Requires logging.level
     * to be set to 'trace' to provide any useful output.
     *
     * WARNING: The tracer tracing data is likely only to be intelligible to a
     * small number of people inside New Relic, so you should probably only
     * enable tracer tracing if asked to by New Relic, because it will affect
     * performance significantly.
     *
     * @env NEW_RELIC_DEBUG_TRACER
     */
    tracer_tracing: true
  },
  /**
   * Rules for naming or ignoring transactions.
   */
  rules: {
    /**
     * A list of rules of the format {pattern: 'pattern', name: 'name'} for
     * matching incoming request URLs and naming the associated New Relic
     * transactions. Both pattern and name are required. Additional attributes
     * are ignored. Patterns may have capture groups (following JavaScript
     * conventions), and names will use $1-style replacement strings. See
     * the documentation for addNamingRule for important caveats.
     *
     * @env NEW_RELIC_NAMING_RULES
     */
    name: [],
    /**
     * A list of patterns for matching incoming request URLs to be ignored by
     * the agent. Patterns may be strings or regular expressions.
     *
     * @env NEW_RELIC_IGNORING_RULES
     */
    ignore: []
  },
  /**
   * By default, any transactions that are not affected by other bits of
   * naming logic (the API, rules, or metric normalization rules) will
   * have their names set to 'NormalizedUri/*'. Setting this value to
   * false will set them instead to Uri/path/to/resource. Don't change
   * this setting unless you understand the implications of New Relic's
   * metric grouping issues and are confident your application isn't going
   * to run afoul of them. Your application could end up getting black holed!
   * Nobody wants that.
   *
   * @env NEW_RELIC_ENFORCE_BACKSTOP
   */
  enforce_backstop: true,
  /**
   * Browser Monitoring
   *
   * Browser monitoring lets you correlate transactions between the server and browser
   * giving you accurate data on how long a page request takes, from request,
   * through the server response, up until the actual page render completes.
   */
  browser_monitoring: {

    /**
     * Enable browser monitoring header generation.
     *
     * This does not auto-instrument, rather it enables the agent to generate headers.
     * The newrelic module can generate the appropriate <script> header, but you must
     * inject the header yourself, or use a module that does so.
     *
     * Usage:
     *
     *     var newrelic = require('newrelic');
     *
     *     router.get('/', function (req, res) {
     *       var header = newrelic.getBrowserTimingHeader();
     *       res.write(header)
     *       // write the rest of the page
     *     });
     *
     * This generates the <script>...</script> header necessary for Browser Monitoring
     * This script must be manually injected into your templates, as high as possible
     * in the header, but _after_ any X-UA-COMPATIBLE HTTP-EQUIV meta tags.
     * Otherwise you may hurt IE!
     *
     * This method must be called _during_ a transaction, and must be called every
     * time you want to generate the headers.
     *
     * Do *not* reuse the headers between users, or even between requests.
     *
     * @env NEW_RELIC_BROWSER_MONITOR_ENABLE
     */
    enable: true,

    /**
     * Request un-minified sources from the server.
     *
     * @env NEW_RELIC_BROWSER_MONITOR_DEBUG
     */
    debug: false
  },
  /**
   * Transaction Events
   *
   * Transaction events are sent to New Relic Insights. This event data
   * includes transaction timing, transaction name, and any custom parameters.
   *
   * Read more here: http://newrelic.com/insights
   */
  transaction_events: {
    /**
     * If this is disabled, the agent does not collect, nor try to send,
     * analytic data.
     */
    enabled: true,

    /**
     * The agent will collect all events up to this number per minute. If
     * there are more than that, a statistical sampling will be collected.
     */
    max_samples_per_minute: 10000,

    /**
     * This is used if the agent is unable to send events to the collector.
     * The values from the previous harvest cycle will be merged into the next
     * one with this option as the limit.
     *
     * This should be *greater* than max_samples_per_minute or you'll see odd
     * behavior. You probably want at least double the value, but more is okay
     * as long as you can handle the memory overhead.
     */
    max_samples_stored: 20000
  },

  /**
   * Custom Insights Events
   *
   * Custom insights events are JSON object that are sent to New Relic
   * Insights. You can tell the agent to send your custom events via the
   * `newrelic.recordCustomEvent()` API. These events are sampled once the max
   * reservoir size is reached. You can tune this setting below.
   *
   * Read more here: http://newrelic.com/insights
   */
  custom_insights_events: {
    /**
     * If this is disabled, the agent does not collect, nor try to send, custom
     * event data.
     */
    enabled: true,
    /**
     * The agent will collect all events up to this number per minute. If there
     * are more than that, a statistical sampling will be collected. Current
     * this uses a reservoir sampling algorithm.
     *
     * By increasing this setting you are both increasing the memory
     * requirements of the agent as well as increasing the payload to the New
     * Relic servers. The memory concerns are something you should consider for
     * your own server's sake. The payload of events is compressed, but if it
     * grows too large the New Relic servers may reject it.
     */
    max_samples_stored: 1000
  },
  /**
   * This is used to configure properties about the user's host name.
   */
  process_host: {
     /**
     * Configurable display name for hosts
     *
     * @env NEW_RELIC_PROCESS_HOST_DISPLAY_NAME
     */
    display_name: '',
    /**
     * ip address preference when creating hostnames
     *
     * @env NEW_RELIC_IPV_PREFERENCE
     */
    ipv_preference: '4'
 },


  /**
   * High Security
   *
   * High security mode (v2) is a setting which prevents any sensitive data from
   * being sent to New Relic. The local setting must match the server setting.
   * If there is a mismatch the agent will log a message and act as if it is
   * disabled.
   *
   * Attributes of high security mode (when enabled):
   *  * requires SSL
   *  * does not allow capturing of http params
   *  * does not allow custom params
   *
   * To read more see: https://docs.newrelic.com/docs/subscriptions/high-security
   */
  high_security: false,

  /**
   * Labels
   *
   * An object of label names and values that will be applied to the data sent
   * from this agent. Both label names and label values have a maximum length of
   * 255 characters. This object should contain at most 64 labels.
   */
  labels: {},

  /**
   * These options control behavior for slow queries, but do not affect sql
   * nodes in transaction traces.
   * slow_sql.enabled enables and disables slow_sql recording
   * slow_sql.max_samples sets the maximum number of slow query samples that
   * will be collected in a single harvest cycle.
   */
   slow_sql: {
    enabled: false,
    max_samples: 10
  }
}
