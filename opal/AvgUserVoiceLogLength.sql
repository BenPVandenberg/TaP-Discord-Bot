SELECT
    SUM(
        TIMESTAMPDIFF(MINUTE, Start, End)
    ) / 
    (select COUNT(id) FROM VoiceLog natural join VoiceSession natural join User
	where UserID = 98498526471786496
	AND End IS NOT NULL)
    AS "Averge Time Spent (min)", Username
FROM VoiceLog natural join VoiceSession natural join User
where UserID = 98498526471786496
AND End IS NOT NULL;