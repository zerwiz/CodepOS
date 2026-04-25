/**
 * Team Manager Skill
 * Enables orchestrator to list and deploy agent teams
 */

import { exec } from 'child_process';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'js-yaml';
import fs from 'fs/promises';

const AGENTS_DIR = '.pi/multi-team/agents/';
const CONFIG_PATH = '.pi/multi-team/multi-team-config.yaml';

/**
 * List available teams
 */
export async function listAvailableTeams() {
    try {
        const entries = await readdir(AGENTS_DIR, { withFileTypes: true });
        const teams = entries
            .filter(dirent => dirent.isDirectory() && dirent.name !== 'orchestrator')
            .map(dirent => dirent.name);
        return {
            status: 'success',
            teams,
            count: teams.length
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        };
    }
}

/**
 * Deploy or swap a team
 */
export async function deployTeam(teamName) {
    return new Promise((resolve) => {
        // Validate team exists first
        listAvailableTeams().then(result => {
            if (!result.teams.includes(teamName)) {
                resolve({
                    status: 'error',
                    error: `Team "${teamName}" not found. Available: ${result.teams.join(', ')}`
                });
                return;
            }

            console.log(`[Orchestrator] Deploying team: ${teamName}...`);
            
            exec(`just team ${teamName}`, (error, stdout, stderr) => {
                if (error) {
                    resolve({
                        status: 'error',
                        error: error.message,
                        stderr: stderr
                    });
                    return;
                }
                resolve({
                    status: 'success',
                    output: stdout
                });
            });
        });
    });
}

/**
 * Update active team configuration
 */
export async function updateActiveTeamConfig(newTeamName) {
    try {
        await fs.access(CONFIG_PATH).catch(() => {
            // Create default config if it doesn't exist
            fs.writeFile(CONFIG_PATH, yaml.stringify({
                active_team: newTeamName || 'orchestrator',
                teams: []
            }), 'utf8');
            console.log(`[Orchestrator] Created default config for team: ${newTeamName}`);
            return {
                status: 'created',
                message: `Created config for team: ${newTeamName}`
            };
        });

        const file = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = yaml.parse(file);
        
        config.active_team = newTeamName;
        
        await fs.writeFile(CONFIG_PATH, yaml.stringify(config), 'utf8');
        return {
            status: 'success',
            message: `Config updated to route to ${newTeamName}`
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        };
    }
}

/**
 * Get current active team
 */
export async function getCurrentTeam() {
    try {
        const file = await fs.readFile(CONFIG_PATH, 'utf8');
        const config = yaml.parse(file);
        return {
            status: 'success',
            data: config.active_team || 'orchestrator'
        };
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        };
    }
}
