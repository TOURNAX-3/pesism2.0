import type { FairPlayRow } from '@/lib/tournax-api';
import { CompetitionComingSoon } from './competition-coming-soon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function AdminFairPlayView({ rows }: { rows: FairPlayRow[] }) {
  return (
    <Card style={{ marginTop: '1.25rem' }}>
      <CardHeader>
        <CardTitle>Fair play (admin only)</CardTitle>
        <CardDescription>
          Totals from match score sheets (fouls and offsides). Not shown on the public site yet — publish when you are ready.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!rows.length ? (
          <CompetitionComingSoon label="Record results with in-game stats under Results → include score sheet stats." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Matches logged</TableHead>
                <TableHead>Fouls</TableHead>
                <TableHead>Offsides</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={row.playerId}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{row.playerName}</TableCell>
                  <TableCell>{row.matchesWithStats}</TableCell>
                  <TableCell className="admin-mono">{row.fouls}</TableCell>
                  <TableCell className="admin-mono">{row.offsides}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
