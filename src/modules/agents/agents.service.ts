import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsRepository } from './agents.repository';

@Injectable()
export class AgentsService {
  constructor(private readonly agentsRepository: AgentsRepository) {}
  async create(createAgentDto: CreateAgentDto) {
    const agent = await this.agentsRepository.findOne({
      agent_code: createAgentDto.agent_code,
    });
    if (agent) {
      throw new BadRequestException('Agent already exists');
    }
    return await this.agentsRepository.create(createAgentDto);
  }

  async findAll() {
    return await this.agentsRepository.find();
  }

  async findOne(id: number) {
    return await this.agentsRepository.findOneOrFail({ id });
  }

  async update(id: number, updateAgentDto: UpdateAgentDto) {
    let agent_code: string;
    if (updateAgentDto.agent_code) {
      const agent = await this.agentsRepository.findOne({
        agent_code: updateAgentDto.agent_code,
      });
      if (agent) {
        throw new BadRequestException('Agent already exists');
      }
      agent_code = updateAgentDto.agent_code;
    }
    return await this.agentsRepository.updateOneOrFail({ id }, updateAgentDto);
  }

  async remove(id: number) {
    return await this.agentsRepository.softDeleteOrFail({ id });
  }
}
