SELECT
    SUM(
        TIMESTAMPDIFF(MINUTE, Start, End)
    ) / 
    (select COUNT(id) FROM VoiceLog natural join VoiceSession natural join User
	where End IS NOT NULL)
    AS "Averge Time Spent (min)"
FROM VoiceLog natural join VoiceSession natural join User
where End IS NOT NULL;