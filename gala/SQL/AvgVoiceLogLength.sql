SELECT
    SUM(
        TIMESTAMPDIFF(MINUTE, Start, End)
    ) / (select COUNT(id) FROM VoiceLog)
    AS "Averge Time Spent (min)"
FROM VoiceLog;