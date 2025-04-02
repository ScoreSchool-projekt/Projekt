SELECT cs.csapatneve, c.pontok
FROM csapat cs
INNER JOIN csoport c ON cs.id = c.csapatid
INNER JOIN torna t ON cs.tornaid = t.id
WHERE t.tornaneve = "Falcsik Ferenc Emléktorna"
ORDER BY `c`.`pontok` DESC;