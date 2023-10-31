import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization.entity';
import { Repository } from 'typeorm';
import { catchError, firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    const newOrganization = this.organizationRepository.create({
      ...createOrganizationDto,
    });
    return this.organizationRepository.save(newOrganization);
  }

  findAll() {
    return this.organizationRepository.find();
  }

  findOne(id: number) {
    return this.organizationRepository.findOneBy({ id });
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationRepository.update(
      { id },
      { ...updateOrganizationDto },
    );
  }

  remove(id: number) {
    return this.organizationRepository.delete({ id });
  }

  async importPartners() {
    const partnersData = await firstValueFrom(
      this.httpService
        .get('https://api.clarisa.cgiar.org/api/institutions')
        .pipe(
          map((d: any) => d.data),
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException();
          }),
        ),
    );
    for (let partner of partnersData) {
      let { added, institutionType, countryOfficeDTO, ...data } = partner;
      const entity = await this.organizationRepository.findOneBy({
        code: partner.code,
      });
      if (entity != null) {
        this.organizationRepository.update(entity.id, { ...data });
      } else {
        const newPartner = this.organizationRepository.create(
          data as Organization,
        );
        newPartner.id = partner.code;
        this.organizationRepository.save(newPartner);
      }
    }
  }
}
